import React from "react";
import { useTranslation } from "react-i18next";

export const TerminalComponent = ({ logs }: { logs: string[] }) => {
  const { t } = useTranslation();
  return (
    <div className="p-4 bg-black text-white rounded-lg shadow-md overflow-auto max-h-96 w-full sm:w-3/4 lg:w-1/2 mx-auto">
      <h3 className="text-lg font-bold mb-2">{t("Terminal Output")}</h3>
      <pre className="whitespace-pre-wrap text-sm p-2 bg-gray-900 rounded-lg overflow-x-auto">
        {logs.length > 0 ? logs.join("\n") : t("No logs available")}
      </pre>
    </div>
  );
};

export default TerminalComponent;
