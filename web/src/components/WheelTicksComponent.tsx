import { useTranslation } from "react-i18next";

export function WheelTicksComponent() {
  const { t } = useTranslation();
  const wheelTicks = useWheelTicks();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-bold">{t("Rear Left")}</h3>
        <p className="text-xl">{wheelTicks?.WheelTicksRl}</p>
      </div>
      <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-bold">{t("Rear Right")}</h3>
        <p className="text-xl">{wheelTicks?.WheelTicksRr}</p>
      </div>
      <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-bold">{t("Rear Left Direction")}</h3>
        <p className="text-xl">{wheelTicks?.WheelDirectionRl}</p>
      </div>
      <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-bold">{t("Rear Right Direction")}</h3>
        <p className="text-xl">{wheelTicks?.WheelDirectionRr}</p>
      </div>
    </div>
  );
}
