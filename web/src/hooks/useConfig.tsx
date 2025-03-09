import { useApi } from "./useApi.ts";
import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

export const useConfig = (keys) => {
    const guiApi = useApi();
    const { t } = useTranslation();
    const [config, setConfig] = useState({});

    const handleSetConfig = useCallback(async (newConfig) => {
        try {
            const offsetConfig = await guiApi.config.keysSetCreate(newConfig);
            if (offsetConfig.error) {
                throw new Error(offsetConfig.error.error ?? "");
            }
            setConfig((oldConfig) => ({
                ...oldConfig,
                ...offsetConfig.data
            }));
        } catch (e) {
            console.error("Error saving config:", e);
        }
    }, [guiApi]);

    useEffect(() => {
        (async () => {
            try {
                const keysMap = Object.fromEntries(keys.map((key) => [key, ""]));
                const offsetConfig = await guiApi.config.keysGetCreate(keysMap);
                if (offsetConfig.error) {
                    throw new Error(offsetConfig.error.error ?? "");
                }
                setConfig(offsetConfig.data);
            } catch (e) {
                console.error("Error loading config:", e);
            }
        })();
    }, [keys, guiApi]);

    return { config, setConfig: handleSetConfig };
};
