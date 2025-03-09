import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface AsyncButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onAsyncClick?: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  label: string;
  theme?: "primary" | "secondary" | "danger";
  className?: string;
}

const AsyncButton: React.FC<AsyncButtonProps> = ({ onAsyncClick, label, theme = "primary", className, ...rest }) => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const themeClasses = {
    primary: "bg-blue-500 hover:bg-blue-600",
    secondary: "bg-gray-500 hover:bg-gray-600",
    danger: "bg-red-500 hover:bg-red-600",
  };

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onAsyncClick) {
      setLoading(true);
      try {
        await onAsyncClick(event);
      } catch (error) {
        console.error("Error in AsyncButton:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <button
      className={`px-4 py-2 rounded text-white ${themeClasses[theme]} disabled:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-800 ${loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={handleClick}
      disabled={loading}
      {...rest}
    >
      {loading ? t("Loading...") : t(label)}
    </button>
  );
};

export default AsyncButton;
