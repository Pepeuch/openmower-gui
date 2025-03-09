import React from "react";
import { useTranslation } from "react-i18next";
import AsyncButton from "./AsyncButton.tsx";
import AsyncDropDownButton from "./AsyncDropDownButton.tsx";
import { useApi } from "../hooks/useApi.ts";
import { useHighLevelStatus } from "../hooks/useHighLevelStatus.ts";

export const useMowerAction = () => {
  const guiApi = useApi();
  return (command: string, args: Record<string, any> = {}) => async () => {
    try {
      const res = await guiApi.openmower.callCreate(command, args);
      if (res.error) {
        throw new Error(res.error.error);
      }
    } catch (e: any) {
      throw new Error(e.message);
    }
  };
};

export const MowerActions: React.FC = () => {
  const { t } = useTranslation();
  const { highLevelStatus } = useHighLevelStatus();
  const mowerAction = useMowerAction();

  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-2">{t("Actions")}</h3>
      <div className="flex flex-wrap gap-2">
        {highLevelStatus.StateName === "IDLE" && (
          <AsyncButton
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onAsyncClick={mowerAction("high_level_control", { Command: 1 })}
          >
            {t("Start")}
          </AsyncButton>
        )}
        {highLevelStatus.StateName !== "IDLE" && (
          <AsyncButton
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            onAsyncClick={mowerAction("high_level_control", { Command: 2 })}
          >
            {t("Home")}
          </AsyncButton>
        )}
        {!highLevelStatus.Emergency ? (
          <AsyncButton
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            onAsyncClick={mowerAction("emergency", { Emergency: 1 })}
          >
            {t("Emergency On")}
          </AsyncButton>
        ) : (
          <AsyncButton
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
            onAsyncClick={mowerAction("emergency", { Emergency: 0 })}
          >
            {t("Emergency Off")}
          </AsyncButton>
        )}
        <AsyncDropDownButton
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
          menu={{
            items: [
              { key: "mower_s1", label: t("Area Recording"), actions: [{ command: "high_level_control", args: { Command: 3 } }] },
              { key: "mower_s2", label: t("Mow Next Area"), actions: [{ command: "high_level_control", args: { Command: 4 } }] }
            ],
            onAsyncClick: async (e) => {
              const item = [
                { key: "mower_s1", label: "Area Recording", actions: [{ command: "high_level_control", args: { Command: 3 } }] },
                { key: "mower_s2", label: "Mow Next Area", actions: [{ command: "high_level_control", args: { Command: 4 } }] }
              ].find(item => item.key === e.key);
              for (const action of item?.actions ?? []) {
                await mowerAction(action.command, action.args)();
              }
            }
          }}
        >
          {t("More")}
        </AsyncDropDownButton>
      </div>
    </div>
  );
};

export default MowerActions;