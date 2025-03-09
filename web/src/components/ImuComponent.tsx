import React from "react";
import { useTranslation } from "react-i18next";
import { useImu } from "../hooks/useImu.ts";

export function ImuComponent() {
  const { t } = useTranslation();
  const imu = useImu();

  const data = [
    { label: "Angular Velocity X", value: imu.AngularVelocity?.X },
    { label: "Angular Velocity Y", value: imu.AngularVelocity?.Y },
    { label: "Angular Velocity Z", value: imu.AngularVelocity?.Z },
    { label: "Linear Acceleration X", value: imu.LinearAcceleration?.X },
    { label: "Linear Acceleration Y", value: imu.LinearAcceleration?.Y },
    { label: "Linear Acceleration Z", value: imu.LinearAcceleration?.Z },
    { label: "Orientation X", value: imu.Orientation?.X },
    { label: "Orientation Y", value: imu.Orientation?.Y },
    { label: "Orientation Z", value: imu.Orientation?.Z },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 text-white">
      {data.map((item, index) => (
        <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-bold">{t(item.label)}</h3>
          <p className="text-green-500">{item.value?.toFixed(9) ?? "-"}</p>
        </div>
      ))}
    </div>
  );
}

export default ImuComponent;