import useWebSocket from "react-use-websocket";
import { useState, useCallback } from "react";

export const useWS = <T>(
    onError: (e: Error) => void,
    onInfo: (msg: string) => void,
    onData: (data: T, first?: boolean) => void
) => {
    const [uri, setUri] = useState<string | null>(null);
    const [first, setFirst] = useState(false);

    const ws = useWebSocket(uri, {
        share: true,
        onOpen: () => {
            console.debug(`Opened stream: ${uri}`);
            onInfo("Stream connected");
        },
        onError: (event) => {
            console.error(`Error on stream: ${uri}`, event);
            onError(new Error("Stream error"));
        },
        onClose: () => {
            console.warn(`Stream closed: ${uri}`);
            onError(new Error("Stream closed"));
        },
        onMessage: (e) => {
            console.debug("Received WebSocket message:", e.data);
        
            let decodedData;
            try {
                decodedData = JSON.parse(e.data);
            } catch (jsonError) {
                try {
                    decodedData = JSON.parse(atob(e.data)); // Essai de décoder en Base64
                    console.warn("Message WebSocket encodé en Base64, décodage réussi.");
                } catch (base64Error) {
                    console.error("Message WebSocket non décodable:", jsonError, base64Error);
                    onError(new Error("Format de message WebSocket inconnu"));
                    return;
                }
            }
        
            if (first) setFirst(false);
            onData(decodedData, first);
        },
    });

    const start = useCallback((endpoint: string) => {
        setFirst(true);
        const protocol = window.location.protocol === "https:" ? "wss" : "ws";
        const host = import.meta.env.DEV ? "localhost:4006" : window.location.host;
        setUri(`${protocol}://${host}${endpoint}`);
    }, []);

    const stop = useCallback(() => {
        const socket = ws.getWebSocket();
        if (socket) {
            console.debug(`Closing stream: ${socket.url}`);
            socket.close();
        }
        setUri(null);
        setFirst(false);
    }, [ws]);

    return { start, stop, sendJsonMessage: ws.sendJsonMessage };
};
