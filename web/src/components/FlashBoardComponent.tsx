import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { createForm, onFieldValueChange } from "@formily/core";
import { Form as FormilyForm, FormButtonGroup, FormItem, FormLayout, Input, NumberPicker, Select, Submit, Checkbox } from "@formily/react";
import { useApi } from "../hooks/useApi.ts";

export const FlashBoardComponent = (props: { onNext: () => void }) => {
  const { t } = useTranslation();
  const form = useMemo(
    () =>
      createForm({
        validateFirst: true,
        effects: (form) => {
          onFieldValueChange("boardType", (field) => {
            form.setFieldState(
              "*(panelType, tickPerM, wheelBase, branch, repository, debugType, disableEmergency, maxMps, maxChargeCurrent, limitVoltage150MA, maxChargeVoltage, batChargeCutoffVoltage, oneWheelLiftEmergencyMillis, bothWheelsLiftEmergencyMillis, tiltEmergencyMillis, stopButtonEmergencyMillis, playButtonClearEmergencyMillis, externalImuAcceleration, externalImuAngular, masterJ18, perimeterWire)",
              (state) => {
                state.display = field.value !== "BOARD_VERMUT_YARDFORCE500" ? "visible" : "hidden";
              }
            );
          });
        },
      }),
    []
  );

  const guiApi = useApi();
  const [loading, setLoading] = useState(false);

  const flashFirmware = async (values: any) => {
    setLoading(true);
    try {
      await guiApi.flashFirmware(values);
    } catch (error) {
      console.error("Error flashing firmware:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-800 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">{t("Flash Board")}</h2>
      <FormilyForm form={form}>
        <FormLayout layout="vertical">
          <FormItem label={t("Board Type")}>
            <Select name="boardType" options={[{ label: "Vermut - YardForce 500 Classic", value: "BOARD_VERMUT_YARDFORCE500" }]} />
          </FormItem>
          <FormItem label={t("Version")}>
            <Input name="version" />
          </FormItem>
          <FormItem label={t("Repository")}>
            <Input name="repository" />
          </FormItem>
          <FormItem label={t("Branch")}>
            <Input name="branch" />
          </FormItem>
          <FormItem label={t("Panel Type")}>
            <Select name="panelType" options={[{ label: "YardForce 500 Classic", value: "PANEL_TYPE_YARDFORCE_500_CLASSIC" }]} />
          </FormItem>
          <FormItem label={t("Max MPS")}>
            <NumberPicker name="maxMps" step={0.1} max={1.0} />
          </FormItem>
          <FormItem label={t("Disable Emergency")}>
            <Checkbox name="disableEmergency" />
          </FormItem>
        </FormLayout>
        <FormButtonGroup>
          <Submit loading={loading} onSubmit={flashFirmware}>{t("Flash Firmware")}</Submit>
          <button onClick={props.onNext} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
            {t("Skip")}
          </button>
        </FormButtonGroup>
      </FormilyForm>
    </div>
  );
};

export default FlashBoardComponent;