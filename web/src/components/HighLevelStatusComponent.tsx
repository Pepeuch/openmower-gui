import React from "react";
import { useTranslation } from "react-i18next";
import { useHighLevelStatus } from "../hooks/useHighLevelStatus.ts";
import { useStatus } from "../hooks/useStatus.ts";
import { useSettings } from "../hooks/useSettings.ts";
import { booleanFormatter, booleanFormatterInverted, progressFormatter, stateRenderer } from "./utils.tsx";

export function HighLevelStatusComponent() {
  const { t } = useTranslation();
  const { highLevelStatus } = useHighLevelStatus();
  const status = useStatus();
  const { settings } = useSettings();

  const estimateRemainingChargingTime = () => {
    if (!status.VBattery || !status.ChargeCurrent || status.ChargeCurrent === 0) {
      return "∞";
    }
    let capacity = parseFloat(settings["OM_BATTERY_CAPACITY_MAH"] ?? "3000.0");
    let full = parseFloat(settings["OM_BATTERY_FULL_VOLTAGE"] ?? "28.0");
    let empty = parseFloat(settings["OM_BATTERY_EMPTY_VOLTAGE"] ?? "23.0");
    if (!capacity || !full || !empty) {
      return "∞";
    }
    const estimatedAmpsPerVolt = capacity / (full - empty);
    let estimatedRemainingAmps = (full - (status.VBattery ?? 0)) * estimatedAmpsPerVolt;
    if (estimatedRemainingAmps < 10) {
      return "∞";
    }
    let remaining = estimatedRemainingAmps / ((status.ChargeCurrent ?? 0) * 1000);
    if (remaining < 0) {
      return "∞";
    }
    return new Date(Date.now() + remaining * (1000 * 60 * 60)).toLocaleTimeString();
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 text-white">
      <div className="bg-gray-800 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-bold">{t("State")}</h3>
        <p className="text-green-500">{stateRenderer(highLevelStatus.StateName)}</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-bold">{t("GPS Quality")}</h3>
        <p>{(highLevelStatus.GpsQualityPercent ?? 0) * 100}%</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-bold">{t("Battery")}</h3>
        <p>{progressFormatter((highLevelStatus.BatteryPercent ?? 0) * 100)}</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-bold">{t("Charging time left")}</h3>
        <p>{highLevelStatus.IsCharging ? estimateRemainingChargingTime() : "-"}</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-bold">{t("Charging")}</h3>
        <p>{booleanFormatter(highLevelStatus.IsCharging ? "Yes" : "No")}</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-bold">{t("Emergency")}</h3>
        <p>{booleanFormatterInverted(highLevelStatus.Emergency ? "Yes" : "No")}</p>
      </div>
    </div>
  );
}

export default HighLevelStatusComponent;