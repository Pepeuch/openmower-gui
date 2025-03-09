import React from "react";
import { useTranslation } from "react-i18next";
import { useHighLevelStatus } from "../hooks/useHighLevelStatus.ts";
import { progressFormatterSmall, stateRenderer } from "./utils.tsx";

export const MowerStatus = () => {
  const { t } = useTranslation();
  const { highLevelStatus } = useHighLevelStatus();

  return (
    <div className="flex space-x-4 text-sm text-white">
      <div className="bg-gray-800 p-2 rounded-lg shadow-md">
        <p className="text-green-500">{stateRenderer(highLevelStatus.StateName)}</p>
      </div>
      <div className="bg-gray-800 p-2 rounded-lg shadow-md flex items-center">
        <span
          className={`mr-2 ${highLevelStatus.GpsQualityPercent > 0 ? "text-green-500" : "text-red-500"}`}
        >📡</span>
        <p>{(highLevelStatus.GpsQualityPercent ?? 0) * 100}%</p>
      </div>
      <div className="bg-gray-800 p-2 rounded-lg shadow-md flex items-center">
        <span
          className={`mr-2 ${highLevelStatus.IsCharging ? "text-green-500" : "text-gray-400"}`}
        >🔋</span>
        <p>{progressFormatterSmall((highLevelStatus.BatteryPercent ?? 0) * 100)}</p>
      </div>
    </div>
  );
};

export default MowerStatus;
