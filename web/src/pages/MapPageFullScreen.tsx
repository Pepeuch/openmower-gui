import { useEffect, useState } from "react";
import Map, { ViewStateChangeInfo } from "react-map-gl";

const FullscreenMap = () => {
    useEffect(() => {
        // Active le mode plein écran si l'URL contient #fullscreen
        if (window.location.hash.includes("#fullscreen")) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error("Erreur lors du passage en plein écran :", err);
            });
            document.body.classList.add("fullscreen-mode");
        }
    }, []);

    // ✅ Ajout du bon type pour éviter les erreurs TypeScript
    const [viewState, setViewState] = useState({
        longitude: 2.3522,
        latitude: 48.8566,
        zoom: 12,
        width: "100vw", // ✅ Ajout explicite de width
        height: "100vh", // ✅ Ajout explicite de height
    });

    return (
        <div style={{ width: "100vw", height: "100vh", position: "absolute", top: 0, left: 0 }}>
            <Map
                {...viewState} // ✅ Passe correctement les coordonnées
                onViewStateChange={(evt: ViewStateChangeInfo) => setViewState({ ...evt.viewState, width: "100vw", height: "100vh" })} // ✅ Mise à jour correcte
                mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
                style={{ width: "100%", height: "100%" }}
                mapboxApiAccessToken="pk.eyJ1IjoiY2VkYm9zc25lbyIsImEiOiJjbGxldjB4aDEwOW5vM3BxamkxeWRwb2VoIn0.WOccbQZZyO1qfAgNxnHAnA" // 🔥 Ajoute ta clé Mapbox ici
            />
        </div>
    );
};

export default FullscreenMap;
