import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import AsyncButton from "./AsyncButton.tsx";
import Terminal, { ColorMode, TerminalOutput } from "react-terminal-ui";
import { useApi } from "../hooks/useApi.ts";

export const FlashGPSComponent = (props: { onNext: () => void; onPrevious: () => void }) => {
  const { t } = useTranslation();
  const [data, setData] = useState<string[]>([]);
  const guiApi = useApi();

  const flashGPS = async () => {
    try {
      await guiApi.flashGPS();
      setData([...data, t("GPS flashed successfully")]);
      setTimeout(() => {
        props.onNext();
      }, 5000);
    } catch (error) {
      setData([...data, t("Error flashing GPS")]);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-800 text-white rounded-lg shadow-lg text-center">
      <h2 className="text-2xl font-bold mb-4">{t("Flash GPS Configuration")}</h2>
      <p className="mb-4">{t("Click the button below to flash your uBlox Z-F9P GPS Configuration.")}</p>
      <div className="bg-black p-4 rounded-lg h-40 overflow-auto">
        <Terminal colorMode={ColorMode.Light}>
          {data.map((line, index) => (
            <TerminalOutput key={index}>{line}</TerminalOutput>
          ))}
        </Terminal>
      </div>
      <div className="flex justify-between mt-4">
        <button onClick={props.onPrevious} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
          {t("Previous")}
        </button>
        <AsyncButton onAsyncClick={flashGPS} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          {t("Flash GPS Configuration")}
        </AsyncButton>
        <button onClick={props.onNext} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
          {t("Skip")}
        </button>
      </div>
    </div>
  );
};

export default FlashGPSComponent;