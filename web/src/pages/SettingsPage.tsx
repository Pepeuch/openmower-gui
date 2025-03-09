import { Typography } from "antd";
import { SettingsComponent } from "../components/SettingsComponent.tsx";
import { Submit } from "@formily/antd-v5";
import AsyncButton from "../components/AsyncButton.tsx";
import i18next from "i18next";

const SettingsPage = () => {
  return (
    <div className="flex flex-col gap-6 p-6">
      <Typography.Title level={2} className="text-lg md:text-2xl">
        {i18next.t("settings.title")}
      </Typography.Title>

      <div className="w-full">
        <SettingsComponent
          actions={(form, save, restartOM, restartGUI) => [
            <Submit
              key="save"
              loading={form.loading}
              onSubmit={save}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              {i18next.t("settings.save")}
            </Submit>,

            <AsyncButton
              key="restartOM"
              onAsyncClick={restartOM}
              className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition"
            >
              {i18next.t("settings.restartOM")}
            </AsyncButton>,

            <AsyncButton
              key="restartGUI"
              onAsyncClick={restartGUI}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
            >
              {i18next.t("settings.restartGUI")}
            </AsyncButton>,
          ]}
        />
      </div>
    </div>
  );
};

export default SettingsPage;
