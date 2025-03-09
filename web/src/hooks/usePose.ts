import { useEffect, useState, useCallback } from "react";
import { AbsolutePose } from "../types/ros.ts";
import { useWS } from "./useWS.ts";

export const usePose = () => {
    const [pose, setPose] = useState<AbsolutePose>({});
    const [isConnected, setIsConnected] = useState(false);

    const handleMessage = useCallback((e: string) => {
        setPose(JSON.parse(e));
    }, []);

    const poseStream = useWS<string>(
        () => {
            console.debug("POSE Stream closed");
            setIsConnected(false);
        },
        () => {
            console.debug("POSE Stream connected");
            setIsConnected(true);
        },
        handleMessage
    );

    useEffect(() => {
        poseStream.start("/api/openmower/subscribe/pose");
        return () => {
            poseStream.stop();
        };
    }, [poseStream]);

    return { pose, isConnected };
};
