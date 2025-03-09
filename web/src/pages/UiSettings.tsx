import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const UISettings: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [developerMode, setDeveloperMode] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-gray-800 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">{t("menu.uiSettings")}</h2>

      {/* Sélection de la langue */}
      <div className="mb-4">
        <label className="block mb-2">{t("Language")}</label>
        <select
          className="w-full p-2 border rounded text-black"
          value={i18n.language}
          onChange={(e) => changeLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
        </select>
      </div>

      {/* Mode développeur */}
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={developerMode}
            onChange={() => setDeveloperMode(!developerMode)}
            className="mr-2"
          />
          {t("Enable Developer Mode")}
        </label>
      </div>

      {/* Placeholder pour d'autres options */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <p>{t("Other UI settings will be added here...")}</p>
      </div>
    </div>
  );
};

export default UISettings;
