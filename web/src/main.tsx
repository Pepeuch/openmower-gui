import './wdyr';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createHashRouter, RouterProvider } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Root from "./routes/root.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";
import LogsPage from "./pages/LogsPage.tsx";
import OpenMowerPage from "./pages/OpenMowerPage.tsx";
import MapPage from "./pages/MapPage.tsx";
import SetupPage from "./pages/SetupPage.tsx";
import UiSettings from "./pages/UiSettings.tsx";
import { MowerStatus } from "./components/MowerStatus.tsx";
import { Spinner } from "./components/Spinner.tsx";
import Layout from "./Layout";
import "./i18n"; // Import de la config i18next
import "./index.css"; // Import de Tailwind

export default function App() {
    return (
      <div className="flex items-center justify-center h-screen bg-blue-500 text-white">
        <h1 className="text-4xl font-bold">Tailwind fonctionne ! 🎉</h1>
      </div>
    );
  }
  
const router = createHashRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            { path: "/settings", element: <SettingsPage /> },
            { path: "/logs", element: <LogsPage /> },
            { path: "/openmower", element: <OpenMowerPage /> },
            { path: "/map", element: <MapPage /> },
            { path: "/setup", element: <SetupPage /> },
            { path: "/ui-settings", element: <UiSettings /> }
        ]
    },
]);

function TopBar() {
    const { t } = useTranslation();
    return (
        <div className="absolute top-0 right-0 z-10 flex items-center gap-4 border-b-2 border-blue-500 px-2 py-1 text-white">
            <MowerStatus />
            <button onClick={() => window.location.hash = "#/ui-settings"} className="text-white hover:text-gray-300">
                ⚙️ {t("Open UI Settings")}
            </button>
        </div>
    );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Layout>
            <TopBar />
            <React.Suspense fallback={<Spinner />}>
                <RouterProvider router={router} />
            </React.Suspense>
        </Layout>
    </React.StrictMode>
);
