import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { useEffect, useState } from "react";
import type { Map } from "mapbox-gl"; // ✅ Utilisation correcte
import DirectSelectWithBoxMode from "../modes/DirectSelectWithBoxMode";

type DrawControlProps = ConstructorParameters<typeof MapboxDraw>[0] & {
    mapInstance: Map | null; // ✅ Passe l'instance correcte
    features?: any[];
    editMode?: boolean;
    onCreate: (evt: any) => void;
    onUpdate: (evt: any) => void;
    onCombine: (evt: any) => void;
    onDelete: (evt: any) => void;
};

export default function DrawControl({ mapInstance, ...props }: DrawControlProps) {
    const [draw, setDraw] = useState<MapboxDraw | null>(null);

    useEffect(() => {
        if (!mapInstance) return;

        const drawInstance = new MapboxDraw({
            ...props,
            modes: {
                ...MapboxDraw.modes,
                direct_select: DirectSelectWithBoxMode,
            },
        });

        setDraw(drawInstance);
        mapInstance.addControl(drawInstance, "top-left");

        mapInstance.on("draw.create", props.onCreate);
        mapInstance.on("draw.update", props.onUpdate);
        mapInstance.on("draw.combine", props.onCombine);
        mapInstance.on("draw.delete", props.onDelete);

        return () => {
            if (!mapInstance) return;
            mapInstance.off("draw.create", props.onCreate);
            mapInstance.off("draw.update", props.onUpdate);
            mapInstance.off("draw.combine", props.onCombine);
            mapInstance.off("draw.delete", props.onDelete);
            mapInstance.removeControl(drawInstance);
        };
    }, [mapInstance, props.editMode]);

    useEffect(() => {
        if (!draw) return;
        draw.changeMode(props.editMode ? "draw_polygon" : "simple_select" as any);
    }, [draw, props.editMode]);
}
