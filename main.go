package main

import (
	"log"

	"github.com/joho/godotenv"
	"github.com/pepeuch/openmower-gui/pkg/api"
	"github.com/pepeuch/openmower-gui/pkg/providers"
)

func main() {
	// ✅ Charger les variables d'environnement (.env) si existant
	if err := godotenv.Load(); err != nil {
		log.Println("⚠️ Avertissement: Impossible de charger .env, utilisation des variables d'environnement existantes.")
	}

	// ✅ Initialisation des providers
	dbProvider := providers.NewDBProvider() // ❌ Suppression de Close()
	dockerProvider := providers.NewDockerProvider()
	rosProvider := providers.NewRosProvider(dbProvider)
	firmwareProvider := providers.NewFirmwareProvider(dbProvider)
	ubloxProvider := providers.NewUbloxProvider()

	// ✅ Vérification et activation de HomeKit si activé
	if isFeatureEnabled(dbProvider, "system.homekit.enabled") {
		log.Println("✅ HomeKit activé")
		providers.NewHomeKitProvider(rosProvider, dbProvider)
	}

	// ✅ Vérification et activation de MQTT si activé
	if isFeatureEnabled(dbProvider, "system.mqtt.enabled") {
		log.Println("✅ MQTT activé")
		providers.NewMqttProvider(rosProvider, dbProvider)
	}

	// ✅ Démarrer l'API
	api.NewAPI(dbProvider, dockerProvider, rosProvider, firmwareProvider, ubloxProvider)
}

// ✅ Fonction pour vérifier si une fonctionnalité est activée dans la DB
func isFeatureEnabled(db *providers.DBProvider, key string) bool {
	value, err := db.Get(key)
	if err != nil {
		log.Printf("⚠️ Impossible de récupérer la clé %s : %v\n", key, err)
		return false
	}
	return string(value) == "true"
}
