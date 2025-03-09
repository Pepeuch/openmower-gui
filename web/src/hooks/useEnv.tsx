import { useApi } from "./useApi.ts";
import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

export const useEnv = () => {
    const guiApi = useApi();
    const { t } = useTranslation();
    const [env, setEnv] = useState<Record<string, any>>({});
    const [error, setError] = useState<string | null>(null);

    const fetchEnv = useCallback(async () => {
        try {
            const envs = await guiApi.config.envsList();
            if (envs.error) {
                throw new Error(envs.error.error ?? "Unknown error");
            }
            setEnv(envs.data);
            setError(null);
        } catch (e: any) {
            console.error("Failed to load config:", e.message);
            setError(t("Failed to load config"));
        }
    }, [guiApi, t]);

    useEffect(() => {
        fetchEnv();
    }, [fetchEnv]);

    return { env, error };
};
