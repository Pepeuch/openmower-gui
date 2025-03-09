import React, { useState } from 'react';
import { Submit } from '@formily/antd-v5';
import { CheckCircleOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Steps, Typography } from "antd";
import { FlashBoardComponent } from "../components/FlashBoardComponent.tsx";
import { SettingsComponent } from "../components/SettingsComponent.tsx";
import AsyncButton from "../components/AsyncButton.tsx";
import { FlashGPSComponent } from "../components/FlashGPSComponent.tsx";
import { SettingsConfig } from "../hooks/useSettings.ts";
import i18next from "i18next";

const { Step } = Steps;

const SetupWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handlePrevious = () => setCurrentStep((prev) => prev - 1);

  const steps = [
    {
      title: i18next.t("setup.flashBoard.title"),
      content: (
        <Card title={i18next.t("setup.flashBoard.title")} key={"flashBoard"}>
          <FlashBoardComponent onNext={handleNext} />
        </Card>
      ),
    },
    {
      title: i18next.t("setup.flashGPS.title"),
      content: (
        <Card title={i18next.t("setup.flashGPS.title")} key={"flashGPS"}>
          <FlashGPSComponent onNext={handleNext} onPrevious={handlePrevious} />
        </Card>
      ),
    },
    {
      title: i18next.t("setup.configureOpenMower.title"),
      content: (
        <Card title={i18next.t("setup.configureOpenMower.title")} key={"configureOpenMower"}>
          <SettingsComponent 
            contentStyle={{ height: '55vh' }}
            actions={(form, save, restartOM, restartGUI) => [
              <Button key="prev" onClick={handlePrevious} className="bg-gray-300 px-4 py-2 rounded-md">
                {i18next.t("setup.buttons.previous")}
              </Button>,
              <Submit 
                key="save" 
                loading={form.loading} 
                onSubmit={async (values: SettingsConfig) => {
                  await save(values);
                  await restartOM();
                  await restartGUI();
                  handleNext();
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                {i18next.t("setup.buttons.saveAndRestart")}
              </Submit>
            ]}
          />
        </Card>
      ),
    },
    {
      title: i18next.t("setup.setupComplete.title"),
      content: (
        <Card title={i18next.t("setup.setupComplete.title")} key={"complete"}>
          <Row gutter={[16, 16]} className="text-center">
            <Col span={24}>
              <CheckCircleOutlined className="text-green-500 text-6xl" />
              <Typography.Title level={2}>
                {i18next.t("setup.setupComplete.message")}
              </Typography.Title>
            </Col>
            <Col span={24}>
              <AsyncButton 
                onAsyncClick={() => (window.location.href = "/#/openmower")} 
                className="bg-green-500 text-white px-4 py-2 rounded-md"
              >
                {i18next.t("setup.setupComplete.goToDashboard")}
              </AsyncButton>
            </Col>
          </Row>
        </Card>
      ),
    }
  ];

  return (
    <div className="flex flex-col gap-6 p-4">
      <Typography.Title level={2} className="text-2xl">
        {i18next.t("setup.title")}
      </Typography.Title>
      <Typography.Text className="text-red-600">
        {i18next.t("setup.warning")}
      </Typography.Text>

      <Steps current={currentStep} className="my-4">
        {steps.map((step) => <Step key={step.title} title={step.title} />)}
      </Steps>

      <div className="steps-content">{steps[currentStep].content}</div>
    </div>
  );
};

export default SetupWizard;
