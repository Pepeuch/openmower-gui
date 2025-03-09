import { useEffect, useState, useCallback } from "react";
import { Status } from "../types/ros.ts";
import { useWS } from "./useWS.ts";

export const useStatus = () => {
    const [status, setStatus] = useState<Status>({});
    const [isConnected, setIsConnected] = useState(false);

    const handleMessage = useCallback((e: string) => {
        setStatus(JSON.parse(e));
    }, []);

    const statusStream = useWS<string>(
        () => {
            console.debug("Status Stream closed");
            setIsConnected(false);
        },
        () => {
            console.debug("Status Stream connected");
            setIsConnected(true);
        },
        handleMessage
    );

    useEffect(() => {
        statusStream.start("/api/openmower/subscribe/status");
        return () => {
            statusStream.stop();
        };
    }, [statusStream]);

    return { status, isConnected };
};
