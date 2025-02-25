package main

import (
	"github.com/joho/godotenv"
	"github.com/pepeuch/openmower-gui/pkg/api"
	"github.com/pepeuch/openmower-gui/pkg/providers"
)

func main() {
	_ = godotenv.Load()

	dbProvider := providers.NewDBProvider()
	dockerProvider := providers.NewDockerProvider()
	rosProvider := providers.NewRosProvider(dbProvider)
	firmwareProvider := providers.NewFirmwareProvider(dbProvider)
	ubloxProvider := providers.NewUbloxProvider()
	homekitEnabled, err := dbProvider.Get("system.homekit.enabled")
	if err != nil {
		panic(err)
	}
	if string(homekitEnabled) == "true" {
		providers.NewHomeKitProvider(rosProvider, dbProvider)
	}
	mqttEnabled, err := dbProvider.Get("system.mqtt.enabled")
	if err != nil {
		panic(err)
	}
	if string(mqttEnabled) == "true" {
		providers.NewMqttProvider(rosProvider, dbProvider)
	}
	api.NewAPI(dbProvider, dockerProvider, rosProvider, firmwareProvider, ubloxProvider)
}
