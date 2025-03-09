import { useEffect, useState, useCallback } from "react";
import { Imu } from "../types/ros.ts";
import { useWS } from "./useWS.ts";

export const useImu = () => {
    const [imu, setImu] = useState<Imu>({});
    const [isConnected, setIsConnected] = useState(false);

    const handleMessage = useCallback((e: string) => {
        setImu(JSON.parse(e));
    }, []);

    const imuStream = useWS<string>(
        () => {
            console.debug("IMU Stream closed");
            setIsConnected(false);
        },
        () => {
            console.debug("IMU Stream connected");
            setIsConnected(true);
        },
        handleMessage
    );

    useEffect(() => {
        imuStream.start("/api/openmower/subscribe/imu");
        return () => {
            imuStream.stop();
        };
    }, [imuStream]);

    return { imu, isConnected };
};
