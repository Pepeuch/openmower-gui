import { useTranslation } from "react-i18next";

export const AsyncSwitch: React.FC<AsyncSwitchProps> = ({ onAsyncChange, className, ...rest }) => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    if (onAsyncChange) {
      setLoading(true);
      try {
        await onAsyncChange(checked, event);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <label className={`relative inline-flex items-center cursor-pointer ${className}`}>
      <input
        type="checkbox"
        className="sr-only peer"
        onChange={handleChange}
        disabled={loading}
        {...rest}
      />
      <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-500 peer-focus:ring-2 peer-focus:ring-blue-300 transition"></div>
      <span className="ml-2 text-white">{t(rest.checked ? "Enabled" : "Disabled")}</span>
    </label>
  );
};
