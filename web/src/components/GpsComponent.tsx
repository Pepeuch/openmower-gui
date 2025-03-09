import React from "react";
import { useTranslation } from "react-i18next";
import { useGPS } from "../hooks/useGPS.ts";
import { booleanFormatter, booleanFormatterInverted } from "./utils.tsx";
import { AbsolutePoseFlags as Flags } from "../types/ros.ts";

export function GpsComponent() {
  const { t } = useTranslation();
  const gps = useGPS();

  const flags = gps.Flags ?? 0;
  let fixType = "–";
  if ((flags & Flags.FIXED) !== 0) {
    fixType = "FIX";
  } else if ((flags & Flags.FLOAT) !== 0) {
    fixType = "FLOAT";
  }

  const data = [
    { label: "Position X", value: gps.Pose?.Pose?.Position?.X, precision: 9 },
    { label: "Position Y", value: gps.Pose?.Pose?.Position?.Y, precision: 9 },
    { label: "Altitude", value: gps.Pose?.Pose?.Position?.Z, precision: 2 },
    { label: "Orientation", value: gps.Pose?.Pose?.Orientation?.Z, precision: 2 },
    { label: "Accuracy", value: gps.PositionAccuracy, precision: 3 }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 text-white">
      {data.map((item, index) => (
        <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-bold">{t(item.label)}</h3>
          <p className="text-green-500">{item.value?.toFixed(item.precision) ?? "-"}</p>
        </div>
      ))}
      <div className="bg-gray-800 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-bold">{t("RTK")}</h3>
        <p>{booleanFormatter((flags & Flags.RTK) !== 0 ? "Yes" : "No")}</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-bold">{t("Fix type")}</h3>
        <p className={fixType === "FIX" ? "text-green-500" : "text-red-500"}>{fixType}</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-bold">{t("Dead reckoning")}</h3>
        <p>{booleanFormatterInverted((flags & Flags.DEAD_RECKONING) !== 0 ? "Yes" : "No")}</p>
      </div>
    </div>
  );
}

export default GpsComponent;