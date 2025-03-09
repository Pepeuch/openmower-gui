import React from "react";
import { useTranslation } from "react-i18next";

export const booleanFormatter = (value: any) =>
  value === "On" || value === "Yes" ? (
    <span className="text-green-500">✔</span>
  ) : (
    <span className="text-red-500">✘</span>
  );

export const booleanFormatterInverted = (value: any) =>
  value === "On" || value === "Yes" ? (
    <span className="text-red-500">✘</span>
  ) : (
    <span className="text-green-500">✔</span>
  );

export const stateRenderer = (value: string | undefined) => {
  const { t } = useTranslation();
  switch (value) {
    case "IDLE":
      return t("Idle");
    case "MOWING":
      return t("Mowing");
    case "DOCKING":
      return t("Docking");
    case "UNDOCKING":
      return t("Undocking");
    case "AREA_RECORDING":
      return t("Area Recording");
    default:
      return t("Unknown");
  }
};

export const progressFormatter = (value: any) => {
  return (
    <div className="w-full bg-gray-300 rounded h-2.5 overflow-hidden">
      <div
        className="h-full bg-blue-500 transition-all"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
};

export const progressFormatterSmall = (value: any) => {
  return (
    <div className="w-full bg-gray-300 rounded h-1.5 overflow-hidden">
      <div
        className="h-full bg-blue-500 transition-all"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
};
