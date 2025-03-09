import { Outlet, useMatches, useNavigate } from "react-router-dom";
import { Layout, Menu } from "antd";
import {
  HeatMapOutlined,
  MessageOutlined,
  RobotOutlined,
  RocketFilled,
  RocketOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { MdOutlineSettings } from "react-icons/md"; // Icône pour UI Settings
import { useEffect } from "react";
import i18next from "i18next";

const menuItems = [
  {
    key: '/openmower',
    label: i18next.t("menu.openMower"),
    icon: <RobotOutlined />
  },
  {
    key: '/setup',
    label: i18next.t("menu.setup"),
    icon: <RocketOutlined />
  },
  {
    key: '/settings',
    label: i18next.t("menu.settings"),
    icon: <SettingOutlined />
  },
  {
    key: '/ui-settings',  // Nouvelle page des paramètres UI
    label: i18next.t("menu.uiSettings"),
    icon: <MdOutlineSettings />
  },
  {
    key: '/map',
    label: i18next.t("menu.map"),
    icon: <HeatMapOutlined />
  },
  {
    key: '/logs',
    label: i18next.t("menu.logs"),
    icon: <MessageOutlined />
  },
  {
    key: 'new',
    label: (
      <span className="beamerTrigger pr-8">
        {i18next.t("menu.whatsNew")}
      </span>
    ),
    icon: <RocketFilled />,
  }
];

const SidebarLayout = () => {
  const route = useMatches();
  const navigate = useNavigate();

  useEffect(() => {
    if (route.length === 1 && route[0].pathname === "/") {
      navigate("/openmower");
    }
  }, [route, navigate]);

  return (
    <Layout className="h-screen">
      {/* Sidebar */}
      <Layout.Sider
        breakpoint="lg"
        collapsedWidth="0"
        className="bg-gray-900"
      >
        <Menu
          theme="dark"
          mode="inline"
          onClick={(info) => {
            if (info.key !== 'new') {
              navigate(info.key);
            }
          }}
          selectedKeys={route.map(r => r.pathname)}
          items={menuItems}
        />
      </Layout.Sider>

      {/* Contenu principal */}
      <Layout className="h-full">
        <Layout.Content className="p-4 bg-white">
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default SidebarLayout;
