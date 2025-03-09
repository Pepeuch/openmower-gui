import { useConfig } from "./useConfig.tsx";
import { useTranslation } from "react-i18next";
import { useEffect, useState, useCallback } from "react";
import { useApi } from "./useApi.ts";
import { App } from "antd";

const { t } = useTranslation();

export const SettingValueType = {
    String: "string",
    Int: "int",
    Float: "float",
    Boolean: "boolean",
    Lat: "lat",
    Lon: "lon",
    Select: "select",
} as const;

export type SettingValueType = typeof SettingValueType[keyof typeof SettingValueType];

export const SettingType = {
    ConfigFile: 0,
    Db: 1,
} as const;

export type SettingType = typeof SettingType[keyof typeof SettingType];

export type SettingBase = {
    settingType: SettingType;
    description: string;
    help?: string;
    section: string;
};

export type Setting =
    | (SettingBase & { type: typeof SettingValueType.String; defaultValue: string })
    | (SettingBase & { type: typeof SettingValueType.Boolean; defaultValue: boolean })
    | (SettingBase & { type: typeof SettingValueType.Int; defaultValue: number })
    | (SettingBase & { type: typeof SettingValueType.Float; defaultValue: number })
    | (SettingBase & { type: typeof SettingValueType.Lat; defaultValue: number })
    | (SettingBase & { type: typeof SettingValueType.Lon; defaultValue: number })
    | (SettingBase & {
          type: typeof SettingValueType.Select;
          defaultValue: string;
          options: ReadonlyArray<{ id: string; label: string }>;
      });

      export const SettingsDesc: Record<string, Setting> = {
        "OM_DATUM_LAT": {
            settingType: SettingType.ConfigFile,
            section: "Datum",
            type: SettingValueType.Lat,
            defaultValue: 43.0,
            description: t("settings.OM_DATUM_LAT"),
            help: t("settings.OM_DATUM_LAT_HELP")
        },
        "OM_DATUM_LONG": {
            settingType: SettingType.ConfigFile,
            section: "Datum",
            type: SettingValueType.Lon,
            defaultValue: 2.0,
            description: t("settings.OM_DATUM_LONG"),
            help: t("settings.OM_DATUM_LONG_HELP")
        },
        "OM_USE_NTRIP": {
            settingType: SettingType.ConfigFile,
            section: "NTRIP",
            type: SettingValueType.Boolean,
            defaultValue: true,
            description: t("settings.OM_USE_NTRIP"),
            help: t("settings.OM_USE_NTRIP_HELP")
        },
        "OM_NTRIP_HOSTNAME": {
            settingType: SettingType.ConfigFile,
            section: "NTRIP",
            type: SettingValueType.String,
            defaultValue: "192.168.178.55",
            description: t("settings.OM_NTRIP_HOSTNAME")
        },
        "OM_NTRIP_PORT": {
            settingType: SettingType.ConfigFile,
            section: "NTRIP",
            type: SettingValueType.Int,
            defaultValue: 2101,
            description: t("settings.OM_NTRIP_PORT")
        },
        "OM_NTRIP_USER": {
            settingType: SettingType.ConfigFile,
            section: "NTRIP",
            type: SettingValueType.String,
            defaultValue: "gps",
            description: t("settings.OM_NTRIP_USER")
        },
        "OM_NTRIP_PASSWORD": {
            settingType: SettingType.ConfigFile,
            section: "NTRIP",
            type: SettingValueType.String,
            defaultValue: "gps",
            description: t("settings.OM_NTRIP_PASSWORD")
        },
        "OM_NTRIP_ENDPOINT": {
            settingType: SettingType.ConfigFile,
            section: "NTRIP",
            type: SettingValueType.String,
            defaultValue: "BASE1",
            description: t("settings.OM_NTRIP_ENDPOINT")
        },
        "OM_MOWER_GAMEPAD": {
            settingType: SettingType.ConfigFile,
            section: "Mower",
            type: SettingValueType.Select,
            defaultValue: "xbox360",
            description: t("settings.OM_MOWER_GAMEPAD"),
            options: [
                { id: "xbox360", label: t("settings.OM_GAMEPAD_XBOX") },
                { id: "ps3", label: t("settings.OM_GAMEPAD_PS3") },
                { id: "steam_stick", label: t("settings.OM_GAMEPAD_STEAM_STICK") },
                { id: "steam_touch", label: t("settings.OM_GAMEPAD_STEAM_TOUCH") }
            ]
        },
    "OM_ENABLE_RECORDING_ALL": {
        settingType: SettingType.ConfigFile,
        section: "Recording",
        type: SettingValueType.Boolean,
        defaultValue: false,
        description: t("Enable recording of all topics")
    },
    "OM_PERIMETER_SIGNAL": {
        settingType: SettingType.ConfigFile,
        section: "Mower",
        type: SettingValueType.Boolean,
        defaultValue: false,
        description: t("Enable perimeter signal")
    },
    "OM_USE_RELATIVE_POSITION": {
        settingType: SettingType.ConfigFile,
        section: "Positioning",
        type: SettingValueType.Boolean,
        defaultValue: false,
        description: t("Use relative position to datum point"),
        help: t("If set to true, the mower will use the position relative to the datum point. If set to false, the mower will use the absolute position.")
    },
    "OM_GPS_PROTOCOL": {
        settingType: SettingType.ConfigFile,
        section: "Positioning",
        type: SettingValueType.Select,
        defaultValue: "UBX",
        description: t("settings.OM_GPS_PROTOCOL"),
        options: [
            { id: "UBX", label: "UBX" },
            { id: "NMEA", label: "NMEA" }
        ]
    },
    "OM_GPS_BAUDRATE": {
        settingType: SettingType.ConfigFile,
        section: "Positioning",
        type: SettingValueType.Int,
        defaultValue: 921600,
        description: t("GPS baudrate")
    },
    "OM_GPS_PORT": {
        settingType: SettingType.ConfigFile,
        section: "Positioning",
        type: SettingValueType.String,
        defaultValue: "/dev/serial/by-id/usb-u-blox_AG_-_www.u-blox.com_u-blox_GNSS_receiver-if00",
        description: "GPS port (/dev/gps on mowgli)"
    },
    "OM_ANTENNA_OFFSET_X": {
        settingType: SettingType.ConfigFile,
        section: "Positioning",
        type: SettingValueType.Float,
        defaultValue: 0.3,
        description: t("Antenna offset X")
    },
    "OM_ANTENNA_OFFSET_Y": {
        settingType: SettingType.ConfigFile,
        section: "Positioning",
        type: SettingValueType.Float,
        defaultValue: 0.0,
        description: t("Antenna offset Y")
    },
    "OM_USE_F9R_SENSOR_FUSION": {
        settingType: SettingType.ConfigFile,
        section: "Positioning",
        help: t("If you want to use F9R's sensor fusion, set this to true (you will also need to set DATUM_LAT and DATUM_LONG). If you want to use the GPS position, set this to false."),
        type: SettingValueType.Boolean, defaultValue: false,
        description: t("Use F9R sensor fusion")
    },
    "OM_DOCKING_DISTANCE": {
        settingType: SettingType.ConfigFile,
        section: "Docking",
        type: SettingValueType.Float, defaultValue: 1.0,
        description: t("Distance to dock")
    },
    "OM_UNDOCK_DISTANCE": {
        settingType: SettingType.ConfigFile,
        section: "Docking",
        type: SettingValueType.Float, defaultValue: 2.0,
        description: t("Distance to undock")
    },
    "OM_DOCKING_EXTRA_TIME": {
        settingType: SettingType.ConfigFile,
        section: "Docking",
        type: SettingValueType.Float, defaultValue: 0.0,
        description: t("Extra time (s) to continue docking after detecting voltage")
    },
    "OM_OUTLINE_COUNT": {
        settingType: SettingType.ConfigFile,
        section: "Navigation",
        type: SettingValueType.Int, defaultValue: 4,
        description: t("Number of points in the outline")
    },
    "OM_MOWING_ANGLE_OFFSET": {
        settingType: SettingType.ConfigFile,
        section: "Mower",
        type: SettingValueType.Float, defaultValue: 0,
        description: t("Mowing angle offset")
    },
    "OM_MOWING_ANGLE_INCREMENT": {
        settingType: SettingType.ConfigFile,
        section: "Mower",
        type: SettingValueType.Float, defaultValue: 0.1,
        description: t("Mowing angle increment")
    },
    "OM_WHEEL_DISTANCE_M": {
        settingType: SettingType.ConfigFile,
        section: "Mower",
        type: SettingValueType.Float, defaultValue: 0.325,
        description: t("Distance between wheels in m")
    },
    "OM_WHEEL_TICKS_PER_M": {
        settingType: SettingType.ConfigFile,
        section: "Mower",
        type: SettingValueType.Float, defaultValue: 1600,
        description: t("Wheel ticks per meter")
    },
    "OM_MOWING_ANGLE_OFFSET_IS_ABSOLUTE": {
        settingType: SettingType.ConfigFile,
        section: "Mower",
        type: SettingValueType.Boolean,
        defaultValue: false,
        description: t("Mowing angle offset is absolute")
    },
    "OM_TOOL_WIDTH": {
        settingType: SettingType.ConfigFile,
        section: "Mower",
        help: t("Choose it smaller than your actual mowing tool in order to have some overlap."),
        type: SettingValueType.Float, defaultValue: 0.13,
        description: t("Tool width")
    },
    "OM_BATTERY_EMPTY_VOLTAGE": {
        settingType: SettingType.ConfigFile,
        help: t("Voltage for battery to be considered empty"),
        section: "Mower",
        type: SettingValueType.Float,
        defaultValue: 25.0,
        description: t("Battery empty voltage")
    },
    "OM_BATTERY_FULL_VOLTAGE": {
        settingType: SettingType.ConfigFile,
        help: t("Voltage for battery to be considered full"),
        section: "Mower",
        type: SettingValueType.Float,
        defaultValue: 28.5,
        description: t("Battery full voltage")
    },
    "OM_BATTERY_CAPACITY_MAH": {
        settingType: SettingType.ConfigFile,
        help: t("Battery capacity in mAh"),
        section: "Mower",
        type: SettingValueType.Float,
        defaultValue: 3000.0,
        description: t("Battery capacity")
    },
    "OM_MOWING_MOTOR_TEMP_HIGH": {
        settingType: SettingType.ConfigFile,
        help: t("If the temperature of the mowing motor is higher than this value, the mower will stop."),
        section: "Mower",
        type: SettingValueType.Float,
        defaultValue: 80.0,
        description: t("Mowing motor temperature high")
    },
    "OM_MOWING_MOTOR_TEMP_LOW": {
        settingType: SettingType.ConfigFile,
        section: "Mower",
        help: t("If the temperature of the mowing motor is lower than this value, the mower will start again."),
        type: SettingValueType.Float,
        defaultValue: 40.0,
        description: t("Mowing motor temperature low")
    },
    "OM_GPS_WAIT_TIME_SEC": {
        settingType: SettingType.ConfigFile,
        section: "Positioning",
        type: SettingValueType.Float,
        defaultValue: 10.0,
        description: t("GPS wait time")
    },
    "OM_GPS_TIMEOUT_SEC": {
        settingType: SettingType.ConfigFile,
        section: "Positioning",
        type: SettingValueType.Float,
        defaultValue: 5.0,
        description: t("GPS timeout")
    },
    "OM_ENABLE_MOWER": {
        settingType: SettingType.ConfigFile,
        section: "Mower",
        type: SettingValueType.Boolean,
        defaultValue: true,
        description: t("Enable mower")
    },
    "OM_AUTOMATIC_MODE": {
        settingType: SettingType.ConfigFile,
        section: "Mower",
        type: SettingValueType.Select,
        defaultValue: "0",
        description: t("settings.OM_AUTOMATIC_MODE"),
        options: [
            { id: "0", label: t("settings.OM_AUTOMATIC_MODE_MANUAL") },
            { id: "1", label: t("settings.OM_AUTOMATIC_MODE_SEMIAUTO") },
            { id: "2", label: t("settings.OM_AUTOMATIC_MODE_AUTO") }
        ]
    },
    "OM_OUTLINE_OFFSET": {
        settingType: SettingType.ConfigFile,
        section: "Navigation",
        help: t("Offset of the outline from the boundary in meters."),
        type: SettingValueType.Float,
        defaultValue: 0.05,
        description: t("Outline offset")
    },
    "OM_OUTLINE_OVERLAP_COUNT": {
        settingType: SettingType.ConfigFile,
        section: "Navigation",
        help: t("Number of points in the overlap"),
        type: SettingValueType.Int, 
        defaultValue: 0,
        description: t("How many outlines should the fill (lanes) overlap")
    },
    "OM_MQTT_ENABLE": {
        settingType: SettingType.ConfigFile,
        section: "OpenMower MQTT",
        type: SettingValueType.Boolean,
        defaultValue: false,
        description: t("Enable OpenMower MQTT")
    },
    "OM_MQTT_HOSTNAME": {
        settingType: SettingType.ConfigFile,
        section: "OpenMower MQTT",
        type: SettingValueType.String,
        defaultValue: "your_mqtt_broker",
        description: t("MQTT broker hostname")
    },
    "OM_MQTT_PORT": {
        settingType: SettingType.ConfigFile,
        section: "OpenMower MQTT",
        type: SettingValueType.Int,
        defaultValue: 1883,
        description: t("MQTT broker port")
    },
    "OM_MQTT_USER": {
        settingType: SettingType.ConfigFile,
        section: "OpenMower MQTT",
        type: SettingValueType.String,
        defaultValue: "",
        description: t("MQTT broker username")
    },
    "OM_MQTT_PASSWORD": {
        settingType: SettingType.ConfigFile,
        section: "OpenMower MQTT",
        type: SettingValueType.String,
        defaultValue: "",
        description: t("MQTT broker password")
    },
    "system.api.addr": {
        settingType: SettingType.Db,
        section: "API",
        type: SettingValueType.String,
        defaultValue: ":4006",
        description: t("API address")
    },
    "system.api.webDirectory": {
        settingType: SettingType.Db,
        section: "API",
        type: SettingValueType.String,
        defaultValue: "/app/web",
        description: t("API web directory")
    },
    "system.map.enabled": {
        settingType: SettingType.Db,
        section: "Map",
        type: SettingValueType.Boolean,
        defaultValue: false,
        description: t("Enable map tiles"),
    },
    "system.map.tileServer": {
        settingType: SettingType.Db,
        section: "Map",
        type: SettingValueType.String,
        defaultValue: "",
        description: t("Tile server URL"),
    },
    "system.map.tileUri": {
        settingType: SettingType.Db,
        section: "Map",
        type: SettingValueType.String,
        defaultValue: "/tiles/vt/lyrs=s,h&x={x}&y={y}&z={z}",
        description: t("Tile server URI"),
    },
    "system.mower.configFile": {
        settingType: SettingType.Db,
        section: "Mower",
        type: SettingValueType.String,
        defaultValue: "/config/mower_config.sh",
        description: t("Mower config file"),
    },
    "system.mqtt.enabled": {
        settingType: SettingType.Db,
        section: "GUI MQTT",
        type: SettingValueType.Boolean,
        defaultValue: false,
        description: t("Enable GUI MQTT"),
    },
    "system.mqtt.host": {
        settingType: SettingType.Db,
        section: "GUI MQTT",
        type: SettingValueType.String,
        defaultValue: ":1883",
        description: t("GUI MQTT host"),
    },
    "system.mqtt.prefix": {
        settingType: SettingType.Db,
        section: "GUI MQTT",
        type: SettingValueType.String,
        defaultValue: "/gui",
        description: t("GUI MQTT prefix"),
    },
    "system.homekit.enabled": {
        settingType: SettingType.Db,
        section: "HomeKit",
        type: SettingValueType.Boolean,
        defaultValue: false,
        description: t("Enable HomeKit"),
    },
    "system.homekit.pincode": {
        settingType: SettingType.Db,
        section: "HomeKit",
        type: SettingValueType.String,
        defaultValue: "00102003",
        description: t("HomeKit Pin Code"),
    },
    "system.ros.nodeName": {
        settingType: SettingType.Db,
        section: "ROS",
        type: SettingValueType.String,
        defaultValue: "openmower-gui",
        description: t("ROS node name"),
    },
    "system.ros.masterUri": {
        settingType: SettingType.Db,
        section: "ROS",
        type: SettingValueType.String,
        defaultValue: "http://localhost:11311",
        description: t("ROS master URI"),
    },
    "system.ros.nodeHost": {
        settingType: SettingType.Db,
        section: "ROS",
        type: SettingValueType.String,
        defaultValue: "localhost",
        description: t("ROS node host"),
    }
}
export type SettingsConfig = Record<keyof typeof SettingsDesc, any>;

const SettingKeysFromDB = Object.keys(SettingsDesc).filter(
    (key) => SettingsDesc[key].settingType === SettingType.Db
);

const flattenConfig = (config: Record<string, any>, parentKey = ""): Record<string, any> => {
    return Object.entries(config).reduce((acc, [key, value]) => {
        const newKey = parentKey ? `${parentKey}.${key}` : key;
        if (typeof value === "object" && value !== null) {
            Object.assign(acc, flattenConfig(value, newKey));
        } else {
            acc[newKey] = value;
        }
        return acc;
    }, {} as Record<string, any>);
};

export const useSettings = () => {
    const guiApi = useApi();
    const { notification } = App.useApp();
    const db = useConfig(SettingKeysFromDB);
    const [settings, setSettings] = useState<SettingsConfig>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    // Charger la configuration depuis la base de données
    useEffect(() => {
        if (!isLoaded && db.config) {
            const newSettings = Object.fromEntries(
                Object.entries(db.config).map(([key, value]) => [
                    key,
                    SettingsDesc[key]?.type === SettingValueType.Boolean
                        ? value === "true"
                        : value,
                ])
            );

            setSettings((prev) => ({ ...prev, ...newSettings }));
            setIsLoaded(true);
        }
    }, [db.config, isLoaded]);

    // Charger les paramètres depuis l'API
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setLoading(true);
                const settingsList = await guiApi.settings.settingsList();
                if (settingsList.error) {
                    throw new Error(settingsList.error.error);
                }

                const fetchedSettings = settingsList.data.settings ?? {};
                const newSettings = Object.fromEntries(
                    Object.entries(fetchedSettings).map(([key, value]) => [
                        key,
                        SettingsDesc[key]?.type === SettingValueType.Boolean
                            ? value === "True" || value == "1"
                            : value,
                    ])
                );

                setSettings((prev) => ({ ...prev, ...newSettings }));
                setLoading(false);
            } catch (e: any) {
                notification.error({
                    message: t("Error loading settings"),
                    description: e.message,
                });
                setLoading(false);
            }
        };

        fetchSettings();
    }, [guiApi]);

    // Fonction pour mettre à jour la configuration
    const handleSetConfig = useCallback(async (newConfig: SettingsConfig) => {
        try {
            setLoading(true);
            const flattenedConfig = flattenConfig(newConfig);

            const configFiltered = Object.fromEntries(
                Object.entries(flattenedConfig).filter(([key]) => SettingsDesc[key]?.settingType === SettingType.ConfigFile)
            );

            const dbFiltered = Object.fromEntries(
                Object.entries(flattenedConfig).filter(([key]) => SettingsDesc[key]?.settingType === SettingType.Db)
            );

            const res = await guiApi.settings.settingsCreate(configFiltered);
            if (res.error) {
                throw new Error(res.error.error);
            }

            await db.setConfig(dbFiltered);

            notification.success({
                message: t("Settings saved successfully"),
            });
            setLoading(false);
        } catch (e: any) {
            notification.error({
                message: t("Error saving settings"),
                description: e.message,
            });
            setLoading(false);
        }
    }, [guiApi, db]);

    return { settings, setSettings: handleSetConfig, loading };
};