import { useEffect, useState, useCallback } from "react";
import { HighLevelStatus } from "../types/ros.ts";
import { useWS } from "./useWS.ts";

export const useHighLevelStatus = () => {
    const [highLevelStatus, setHighLevelStatus] = useState<HighLevelStatus>({});
    const [isConnected, setIsConnected] = useState(false);

    const handleMessage = useCallback((e: string) => {
        setHighLevelStatus(JSON.parse(e));
    }, []);

    const highLevelStatusStream = useWS<string>(
        () => {
            console.debug("High Level Status Stream closed");
            setIsConnected(false);
        },
        () => {
            console.debug("High Level Status Stream connected");
            setIsConnected(true);
        },
        handleMessage,
        (err) => {
            console.error("WebSocket Error:", err);
        }
    );
    

    useEffect(() => {
        highLevelStatusStream.start("/api/openmower/subscribe/highLevelStatus");
        return () => {
            highLevelStatusStream.stop();
        };
    }, [highLevelStatusStream]);

    return { highLevelStatus, isConnected, stop: highLevelStatusStream.stop, start: highLevelStatusStream.start };
};
