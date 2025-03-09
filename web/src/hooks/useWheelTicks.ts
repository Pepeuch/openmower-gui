import { useEffect, useState, useCallback } from "react";
import { WheelTick } from "../types/ros.ts";
import { useWS } from "./useWS.ts";

export const useWheelTicks = () => {
    const [wheelTicks, setWheelTicks] = useState<WheelTick>({});
    const [isConnected, setIsConnected] = useState(false);

    const handleMessage = useCallback((e: string) => {
        setWheelTicks(JSON.parse(e));
    }, []);

    const ticksStream = useWS<string>(
        () => {
            console.debug("Wheel Ticks Stream closed");
            setIsConnected(false);
        },
        () => {
            console.debug("Wheel Ticks Stream connected");
            setIsConnected(true);
        },
        handleMessage
    );

    useEffect(() => {
        ticksStream.start("/api/openmower/subscribe/ticks");
        return () => {
            ticksStream.stop();
        };
    }, [ticksStream]);

    return { wheelTicks, isConnected };
};
