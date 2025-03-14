import React, { useEffect, useRef } from "react";

// Define a global interface to add Leaflet to the Window type
declare global {
  interface Window {
    L: any;
  }
}

function MapComponent() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const isMapInitialized = useRef<boolean>(false);

  // Single coords: 75 Court St
  const storeCoords = { lat: 42.099068, lng: -75.911769 };

  // Leafly logo for the pin
  const leaflyPinUrl =
    "https://leafly-public.imgix.net/dispensary/photos/gallery376885/TywOs1b0SGOB3xSQ3EPm_image1.jpeg";

  const initializeMap = () => {
    if (!mapRef.current || isMapInitialized.current || !window.L) return;

    // Create the map, center on storeCoords with a comfortable zoom
    const map = window.L.map(mapRef.current, {
      center: [storeCoords.lat, storeCoords.lng],
      zoom: 16,
    });
    mapInstanceRef.current = map;
    isMapInitialized.current = true;

    // Add base tiles
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // Create the custom pin icon
    const pinIcon = window.L.divIcon({
      className: "custom-map-marker",
      html: `
        <div class="leafly-pin" style="display:flex;align-items:center;justify-content:center;">
          <img 
            src="${leaflyPinUrl}"
            alt="Store Pin"
            style="
              width:36px;
              height:36px;
              object-fit:cover;
              border-radius:50%;
              border:2px solid #fff;
              box-shadow:0 2px 6px rgba(0,0,0,0.4);
            "
          />
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });

    // Place one marker on the map
    window.L.marker([storeCoords.lat, storeCoords.lng], { icon: pinIcon })
      .addTo(map)
      .bindPopup("Just Breathe<br>75 Court St, Binghamton");
  };

  useEffect(() => {
    const handleScriptLoad = () => {
      if (window.L) {
        initializeMap();
      }
    };

    // Load Leaflet if not already
    if (!window.L && !document.getElementById("leaflet-script")) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
      link.crossOrigin = "";
      document.head.appendChild(link);

      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
      script.crossOrigin = "";
      script.id = "leaflet-script";
      script.onload = handleScriptLoad;
      document.head.appendChild(script);
    } else if (window.L && !isMapInitialized.current) {
      initializeMap();
    }

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          console.error("Error removing map:", e);
        }
        mapInstanceRef.current = null;
        isMapInitialized.current = false;
      }
    };
  }, []);

  return (
    <div className="map-container">
      <div
        ref={mapRef}
        className="map-placeholder"
        style={{ height: "250px" }}
      ></div>
    </div>
  );
}

export default MapComponent;
