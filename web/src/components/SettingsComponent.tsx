import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createForm, onFieldValueChange } from "@formily/core";
import { Form as FormilyForm, FormButtonGroup, FormItem, FormLayout, Input, NumberPicker, Select, Switch } from "@formily/react";
import { useSettings } from "../hooks/useSettings.ts";

export const SettingsComponent: React.FC = () => {
  const { t } = useTranslation();
  const form = useMemo(
    () =>
      createForm({
        validateFirst: true,
        effects: (form) => {
          onFieldValueChange("OM_USE_NTRIP", (field) => {
            form.setFieldState("*(OM_NTRIP_PORT,OM_NTRIP_USER,OM_NTRIP_PASSWORD,OM_NTRIP_ENDPOINT)", (state) => {
              state.display = field.value ? "visible" : "hidden";
            });
          });
        },
      }),
    []
  );

  const { settings, setSettings, loading } = useSettings();

  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      form.setInitialValues(settings);
    }
  }, [settings]);

  useEffect(() => {
    form.setLoading(loading);
  }, [loading]);

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-800 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">{t("Settings")}</h2>
      <FormilyForm form={form}>
        <FormLayout layout="vertical">
          <FormItem label={t("Mower Type")}>
            <Select name="OM_MOWER" options={[{ label: "Custom", value: "CUSTOM" }]} />
          </FormItem>
          <FormItem label={t("Hardware Version")}>
            <Input name="OM_HARDWARE_VERSION" />
          </FormItem>
          <FormItem label={t("Enable NTRIP")}>
            <Switch name="OM_USE_NTRIP" />
          </FormItem>
          <FormItem label={t("Battery Full Voltage")}> 
            <NumberPicker name="OM_BATTERY_FULL_VOLTAGE" step={0.1} />
          </FormItem>
          <FormItem label={t("Battery Empty Voltage")}>
            <NumberPicker name="OM_BATTERY_EMPTY_VOLTAGE" step={0.1} />
          </FormItem>
        </FormLayout>
        <FormButtonGroup>
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            {t("Save Settings")}
          </button>
        </FormButtonGroup>
      </FormilyForm>
    </div>
  );
};

export default SettingsComponent;
