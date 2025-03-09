import MapboxDraw from '@mapbox/mapbox-gl-draw';
import type { ControlPosition } from '@vis.gl/react-mapbox';
import { useControl } from '@vis.gl/react-mapbox';
import { useEffect } from "react";
import DirectSelectWithBoxMode from '../modes/DirectSelectWithBoxMode';

interface DrawControlProps extends Partial<ConstructorParameters<typeof MapboxDraw>[0]> {
    position?: ControlPosition;
    features?: any[];
    editMode?: boolean;
    onCreate?: (evt: any) => void;
    onUpdate?: (evt: any) => void;
    onCombine?: (evt: any) => void;
    onDelete?: (evt: any) => void;
}

export default function DrawControl({ position, features, editMode, onCreate, onUpdate, onCombine, onDelete, ...rest }: DrawControlProps) {
    const draw = useControl<MapboxDraw>(
        () => new MapboxDraw({
            ...rest,
            modes: {
                ...MapboxDraw.modes,
                direct_select: DirectSelectWithBoxMode
            }
        }),
        ({ map }) => {
            map.on('draw.create', onCreate || (() => {}));
            map.on('draw.update', onUpdate || (() => {}));
            map.on('draw.combine', onCombine || (() => {}));
            map.on('draw.delete', onDelete || (() => {}));
        },
        ({ map }) => {
            map.off('draw.create', onCreate || (() => {}));
            map.off('draw.update', onUpdate || (() => {}));
            map.off('draw.combine', onCombine || (() => {}));
            map.off('draw.delete', onDelete || (() => {}));
        },
        { position }
    );

    useEffect(() => {
        if (draw) {
            draw.deleteAll();
            features?.forEach(f => draw.add(f));
        }
    }, [draw, features]);

    useEffect(() => {
        if (draw) {
            draw.changeMode(editMode ? 'draw_polygon' : 'simple_select');
        }
    }, [draw, editMode]);

    return null;
}
