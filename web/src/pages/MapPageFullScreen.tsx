import { useEffect } from "react";
import Map from "react-map-gl";

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

    return (
        <div style={{ width: "100vw", height: "100vh", position: "absolute", top: 0, left: 0 }}>
            <Map
                initialViewState={{ latitude: 48.8566, longitude: 2.3522, zoom: 12 }}
                style={{ width: "100%", height: "100%" }}
                mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
            />
        </div>
    );
};

export default FullscreenMap;
