import MapboxDraw from '@mapbox/mapbox-gl-draw';
import i18next from 'i18next';

const { createSupplementaryPoints, constrainFeatureMovement, doubleClickZoom, moveFeatures } = MapboxDraw.lib;
const { noTarget, isOfMetaType, isActiveFeature, isInactiveFeature, isShiftDown } = MapboxDraw.lib.CommonSelectors;
const Constants = MapboxDraw.constants;

const isVertex = isOfMetaType(Constants.meta.VERTEX);
const isMidpoint = isOfMetaType(Constants.meta.MIDPOINT);

const DirectSelectWithBoxMode: any = {};

// INTERNAL FUNCTIONS
DirectSelectWithBoxMode.fireUpdate = function () {
  this.map.fire(Constants.events.UPDATE, {
    action: Constants.updateActions.CHANGE_COORDINATES,
    features: this.getSelected().map((f: any) => f.toGeoJSON())
  });
};

DirectSelectWithBoxMode.fireActionable = function (state: any) {
  this.setActionableState({
    combineFeatures: false,
    uncombineFeatures: false,
    trash: state.selectedCoordPaths.length > 0
  });
};

DirectSelectWithBoxMode.onSetup = function (opts: any) {
  const featureId = opts.featureId;
  const feature = this.getFeature(featureId);

  if (!feature) {
    throw new Error(i18next.t('error.featureIdRequired'));
  }

  if (feature.type === Constants.geojsonTypes.POINT) {
    throw new TypeError(i18next.t('error.pointNotSupported'));
  }

  const state = {
    featureId,
    feature,
    dragMoveLocation: opts.startPos || null,
    dragMoving: false,
    canDragMove: false,
    selectedCoordPaths: [],
    boxSelecting: false,
    boxStartLocation: null,
    boxSelectElement: undefined,
  };

  this.setSelectedCoordinates(this.pathsToCoordinates(featureId, state.selectedCoordPaths));
  this.setSelected(featureId);
  doubleClickZoom.disable(this);

  this.setActionableState({ trash: true });
  return state;
};

DirectSelectWithBoxMode.onStop = function () {
  doubleClickZoom.enable(this);
  this.clearSelectedCoordinates();
};

DirectSelectWithBoxMode.onTrash = function (state: any) {
  state.selectedCoordPaths
    .sort((a: any, b: any) => b.localeCompare(a, 'en', { numeric: true }))
    .forEach((id: any) => state.feature.removeCoordinate(id));
  this.fireUpdate();
  state.selectedCoordPaths = [];
  this.clearSelectedCoordinates();
  this.fireActionable(state);
  if (!state.feature.isValid()) {
    this.deleteFeature([state.featureId]);
    this.changeMode(Constants.modes.SIMPLE_SELECT, {});
  }
};

DirectSelectWithBoxMode.onClick = function (state: any, e: any) {
  if (noTarget(e)) return this.clickNoTarget(state, e);
  if (isActiveFeature(e)) return this.clickActiveFeature(state, e);
  if (isInactiveFeature(e)) return this.clickInactive(state, e);
  if (isVertex(e)) {
    if (!isShiftDown(e)) {
      state.selectedCoordPaths = [];
    }
    return this.onVertex(state, e);
  }
  this.stopDragging(state);
};

DirectSelectWithBoxMode.getSelectedVerticesInBox = function (feature: any, minX: number, minY: number, maxX: number, maxY: number) {
  const selectedVertices: any[] = [];
  const coordinates = feature.getCoordinates();

  const checkCoordinate = (coord: any, path: any) => {
    const point = this.map.project(coord);
    if (point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY) {
      selectedVertices.push(path);
    }
  };

  const traverseCoordinates = (coords: any, basePath = '') => {
    coords.forEach((coord: any, index: any) => {
      const currentPath = basePath ? `${basePath}.${index}` : `${index}`;
      if (Array.isArray(coord[0])) {
        traverseCoordinates(coord, currentPath);
      } else {
        checkCoordinate(coord, currentPath);
      }
    });
  };

  traverseCoordinates(coordinates);
  return selectedVertices;
};

export default DirectSelectWithBoxMode;
