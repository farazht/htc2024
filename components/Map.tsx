"use client";
import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const Map: React.FC<{ selection: string }> = ({ selection }) => {
  const [geoData, setGeoData] = useState(null);
  const [key, setKey] = useState(0); // Add key for forcing GeoJSON re-render
  const mapRef = useRef<L.Map | null>(null);
  const [selectedWard, setSelectedWard] = useState<string | null>(null);

  // fetch GeoJSON based on the selection prop
  useEffect(() => {
    let geojsonFile = "";
    if (selection === "Ward") {
      geojsonFile = "/Wards.geojson";
    } else if (selection === "Constituency") {
      geojsonFile = "/Constituency.geojson";
    } else if (selection === "Electoral District") {
      geojsonFile = "/ElectoralDistrict.geojson";
    }

    fetch(geojsonFile)
      .then((response) => response.json())
      .then((data) => {
        console.log("GeoJSON Data Loaded:", data);
        setGeoData(data);
        setKey((prev) => prev + 1); // Force GeoJSON to re-render
      })
      .catch((error) => console.error("Error loading GeoJSON:", error));
  }, [selection]);

  const onEachFeature = (feature: any, layer: L.Layer) => {
    if (selection === "Ward") {
      const { councillor, ward_num } = feature.properties;
      if (councillor && ward_num) {
        layer.bindPopup(`<b>Ward ${ward_num}</b> — ${councillor}`);
        layer.on("click", () => setSelectedWard(`Ward ${ward_num}`));
      }
    } else if (selection === "Constituency") {
      const { name, mla } = feature.properties;
      if (name && mla) {
        layer.bindPopup(`<b>${name}</b> — ${mla}`);
        layer.on("click", () => setSelectedWard(name));
      }
    } else if (selection === "Electoral District") {
      const { name, mp } = feature.properties;
      if (name && mp) {
        layer.bindPopup(`<b>${name}</b> — ${mp}`);
        layer.on("click", () => setSelectedWard(name));
      }
    }

    layer.on("mouseover", (e) => {
      layer.openPopup();
    });

    layer.on("mouseout", (e) => {
      layer.closePopup();
    });
  };

  return (
    <div style={{ position: "relative", zIndex: 0 }}>
      <MapContainer
        center={[51.0447, -114.0719]}
        zoom={11}
        style={{ height: "100vh", width: "100%" }}
        zoomControl={true}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        dragging={true}
        whenReady={() => {
          mapRef.current = mapRef.current as L.Map;
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {geoData && (
          <GeoJSON
            key={key} // Add key to force re-render
            data={geoData}
            style={{
              color: "#eb4034",
              weight: 3,
              fillColor: "#eb4034",
              fillOpacity: 0.2,
            }}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>
      <div>
        {selectedWard
          ? `Selected: ${selectedWard}`
          : "Click a ward to see details"}
      </div>
    </div>
  );
};

export default Map;
