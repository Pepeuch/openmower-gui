import React from "react";
import { useTranslation } from "react-i18next";
import { useStatus } from "../hooks/useStatus.ts";

export function StatusComponent() {
  const { t } = useTranslation();
  const status = useStatus();

  const renderEscStatus = (title: string, escStatus: any) => (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-bold">{t(title)}</h3>
      <p>{t("Status")}: {escStatus?.Status}</p>
      <p>{t("Current")}: {escStatus?.Current?.toFixed(2)} A</p>
      <p>{t("Tacho")}: {escStatus?.Tacho}</p>
      <p>{t("RPM")}: {escStatus?.Rpm}</p>
      <p>{t("Motor Temperature")}: {escStatus?.TemperatureMotor?.toFixed(2)} °C</p>
      <p>{t("PCB Temperature")}: {escStatus?.TemperaturePcb?.toFixed(2)} °C</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
      <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold">{t("Status")}</h2>
        <p>{t("Mower status")}: {status.MowerStatus == 255 ? t("On") : t("Off")}</p>
        <p>{t("Raspberry Pi power")}: {status.RaspberryPiPower ? t("On") : t("Off")}</p>
        <p>{t("GPS power")}: {status.GpsPower ? t("On") : t("Off")}</p>
        <p>{t("ESC power")}: {status.EscPower ? t("On") : t("Off")}</p>
        <p>{t("Rain detected")}: {status.RainDetected ? t("Yes") : t("No")}</p>
        <p>{t("Sound module available")}: {status.SoundModuleAvailable ? t("Yes") : t("No")}</p>
        <p>{t("Sound module busy")}: {status.SoundModuleBusy ? t("Yes") : t("No")}</p>
        <p>{t("UI board available")}: {status.UiBoardAvailable ? t("Yes") : t("No")}</p>
        <p>{t("Emergency")}: {status.Emergency ? t("Yes") : t("No")}</p>
        <p>{t("Ultrasonic ranges")}: {status.UltrasonicRanges?.join(", ")}</p>
        <p>{t("Voltage charge")}: {status.VCharge} V</p>
        <p>{t("Voltage battery")}: {status.VBattery} V</p>
        <p>{t("Charge current")}: {status.ChargeCurrent} A</p>
      </div>
      <div>
        {renderEscStatus("Left ESC Status", status.LeftEscStatus)}
        {renderEscStatus("Right ESC Status", status.RightEscStatus)}
        {renderEscStatus("Mow ESC Status", status.MowEscStatus)}
      </div>
    </div>
  );
}

export default StatusComponent;
