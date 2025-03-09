import { useEffect, useState, useCallback } from "react";
import { AbsolutePose } from "../types/ros.ts";
import { useWS } from "./useWS.ts";

export const useGPS = () => {
    const [gps, setGps] = useState<AbsolutePose>({});
    const [isConnected, setIsConnected] = useState(false);

    const handleMessage = useCallback((e: string) => {
        setGps(JSON.parse(e));
    }, []);

    const gpsStream = useWS<string>(
        () => {
            console.debug("GPS Stream closed");
            setIsConnected(false);
        },
        () => {
            console.debug("GPS Stream connected");
            setIsConnected(true);
        },
        handleMessage
    );

    useEffect(() => {
        gpsStream.start("/api/openmower/subscribe/gps");
        return () => {
            gpsStream.stop();
        };
    }, [gpsStream]);

    return { gps, isConnected };
};
