import React from "react";
import { useTranslation } from "react-i18next";

export function Spinner() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      <p className="mt-2 text-gray-400">{t("Loading...")}</p>
    </div>
  );
}

export default Spinner;
