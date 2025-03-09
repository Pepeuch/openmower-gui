import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface AsyncDropDownButtonProps {
  menu: {
    items: { label: string; value: string }[];
    onAsyncClick: (event: any) => Promise<any>;
  };
  className?: string;
  theme?: "primary" | "secondary" | "danger";
  children: React.ReactNode;
}

export const AsyncDropDownButton: React.FC<AsyncDropDownButtonProps> = ({
  menu,
  className,
  theme = "primary",
  children,
}) => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const themeClasses = {
    primary: "bg-blue-500 hover:bg-blue-600",
    secondary: "bg-gray-500 hover:bg-gray-600",
    danger: "bg-red-500 hover:bg-red-600",
  };

  const handleClick = async (event: any) => {
    if (menu.onAsyncClick) {
      setLoading(true);
      try {
        await menu.onAsyncClick(event);
      } catch (error) {
        console.error("Error in AsyncDropDownButton:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={`relative inline-block text-left ${className}`}>
      <button
        className={`px-4 py-2 text-white rounded flex items-center ${themeClasses[theme]} disabled:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-800`}
        disabled={loading}
      >
        {loading ? t("Loading...") : children}
      </button>
      <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg z-10 dark:bg-gray-900 dark:border-gray-700">
        {menu.items.map((item, index) => (
          <button
            key={index}
            className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={(e) => handleClick(item.value)}
          >
            {t(item.label)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AsyncDropDownButton;
