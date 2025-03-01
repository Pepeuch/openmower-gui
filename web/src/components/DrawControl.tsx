import { useControl } from "@vis.gl/react-mapbox";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import type { Feature, FeatureCollection, Geometry, GeoJsonProperties } from "geojson";
import { useEffect } from "react";

export interface DrawControlProps {
    displayControlsDefault?: boolean;
    controls?: {
        point?: boolean;
        line_string?: boolean;
        polygon?: boolean;
        trash?: boolean;
        combine_features?: boolean;
        uncombine_features?: boolean;
    };
    defaultMode?: string;
    onCreate?: (event: { features: Feature[] }) => void;
    onUpdate?: (event: { features: Feature[] }) => void;
    onDelete?: (event: { features: Feature[] }) => void;
    onCombine?: (event: { deletedFeatures: GeoJSON.Feature[] }) => void;
    editMode?: boolean;
    features?: Feature[];
    styles?: any[];
}

const DrawControl = ({
    displayControlsDefault = false,
    controls,
    defaultMode = "simple_select",
    onCreate,
    onUpdate,
    onDelete,
    editMode = false,
    features,
    styles
}: DrawControlProps) => {
    const draw = useControl(() => new MapboxDraw({ displayControlsDefault, controls, defaultMode, styles }));

    useEffect(() => {
        const map = (draw as any)._map; // ✅ Correction : accès à la carte avec `as any`
        if (!map) return;

        const createHandler = onCreate ?? (() => {});
        const updateHandler = onUpdate ?? (() => {});
        const deleteHandler = onDelete ?? (() => {});

        map.on("draw.create", createHandler);
        map.on("draw.update", updateHandler);
        map.on("draw.delete", deleteHandler);

        return () => {
            map.off("draw.create", createHandler);
            map.off("draw.update", updateHandler);
            map.off("draw.delete", deleteHandler);
        };
    }, [draw, onCreate, onUpdate, onDelete]);

    useEffect(() => {
        if (!draw) return;
        draw.changeMode(editMode ? ("draw_polygon" as unknown as string) : ("simple_select" as unknown as string)); // ✅ Correction
    }, [editMode]);

    useEffect(() => {
        if (!draw || !features) return;
        const featureCollection: FeatureCollection<Geometry, GeoJsonProperties> = {
            type: "FeatureCollection",
            features: features
        };
        draw.set(featureCollection);
    }, [features]);

    return null;
};

export default DrawControl;
