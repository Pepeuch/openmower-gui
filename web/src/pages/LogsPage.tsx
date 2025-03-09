import { useEffect, useState, useRef } from "react";
import AsyncButton from "../components/AsyncButton.tsx";
import { useWS } from "../hooks/useWS.ts";
import { useApi } from "../hooks/useApi.ts";
import { MowerActions } from "../components/MowerActions.tsx";
import i18next from "i18next";

type ContainerList = {
  value: string;
  label: string;
  status: "started" | "stopped";
  labels: Record<string, string>;
};

const LogsPage = () => {
  const guiApi = useApi();
  const [containers, setContainers] = useState<ContainerList[]>([]);
  const [containerId, setContainerId] = useState<string | undefined>(undefined);
  const [data, setData] = useState<string[]>([]);
  const logRef = useRef<HTMLDivElement>(null);

  const stream = useWS<string>(
    () => console.error(i18next.t("logs.streamClosed")),
    () => console.info(i18next.t("logs.streamConnected")),
    (e, first) => setData((prev) => (first ? [e] : [...prev, e]))
  );

  const listContainers = async () => {
    try {
      const response = await guiApi.containers.containersList();
      if (response.error) throw new Error(response.error.error);

      const options = response.data.containers?.map((container) => ({
        label: container.labels?.app
          ? `${container.labels.app} ( ${container.names[0].replace("/", "")} )`
          : container.names[0].replace("/", ""),
        value: container.id,
        status: container.state === "running" ? "started" : "stopped",
        labels: container.labels ?? {},
      })) ?? [];

      setContainers(options);
      if (options.length && !containerId) setContainerId(options[0].value);
    } catch (error: any) {
      console.error(i18next.t("logs.fetchError"), error.message);
    }
  };

  useEffect(() => {
    listContainers();
  }, []);

  useEffect(() => {
    if (containerId) {
      stream.start(`/api/containers/${containerId}/logs`);
      return () => stream.stop();
    }
  }, [containerId]);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [data]);

  const commandContainer = (command: "start" | "stop" | "restart") => async () => {
    try {
      if (!containerId) return;
      const res = await guiApi.containers.containersCreate(containerId, command);
      if (res.error) throw new Error(res.error.error);

      command === "start" || command === "restart"
        ? stream.start(`/api/containers/${containerId}/logs`)
        : stream.stop();

      await listContainers();
    } catch (error: any) {
      console.error(i18next.t(`logs.${command}Error`), error.message);
    }
  };

  const selectedContainer = containers.find((c) => c.value === containerId);

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-lg md:text-2xl font-bold">{i18next.t("logs.title")}</h2>

      <MowerActions />

      {/* Sélection du conteneur et boutons */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <select
          className="w-full md:w-auto p-2 border border-gray-300 rounded-md bg-white"
          value={containerId}
          onChange={(e) => setContainerId(e.target.value)}
        >
          {containers.map((container) => (
            <option key={container.value} value={container.value}>
              {container.label}
            </option>
          ))}
        </select>

        {selectedContainer?.status === "started" && (
          <>
            <AsyncButton onAsyncClick={commandContainer("restart")} className="bg-blue-500 text-white px-3 py-2 rounded-md">
              {i18next.t("logs.restart")}
            </AsyncButton>
            <AsyncButton
              disabled={selectedContainer.labels.app === "gui"}
              onAsyncClick={commandContainer("stop")}
              className="bg-red-500 text-white px-3 py-2 rounded-md"
            >
              {i18next.t("logs.stop")}
            </AsyncButton>
          </>
        )}

        {selectedContainer?.status === "stopped" && (
          <AsyncButton onAsyncClick={commandContainer("start")} className="bg-green-500 text-white px-3 py-2 rounded-md">
            {i18next.t("logs.start")}
          </AsyncButton>
        )}
      </div>

      {/* Terminal des logs */}
      <div
        ref={logRef}
        className="bg-black text-green-400 font-mono p-3 overflow-y-auto h-64 md:h-96 rounded-md shadow-md border border-gray-700"
      >
        <pre className="text-sm leading-tight">
          {data.map((line, index) => (
            <div key={index} dangerouslySetInnerHTML={{ __html: line }} />
          ))}
        </pre>
      </div>
    </div>
  );
};

export default LogsPage;
