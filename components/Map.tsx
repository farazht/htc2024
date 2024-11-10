"use client";
import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const Map: React.FC<{ selection: string }> = ({ selection }) => {
  const [geoData, setGeoData] = useState(null);
  const [key, setKey] = useState(0);
  const mapRef = useRef<L.Map | null>(null);

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
        setKey((prev) => prev + 1); // Update key to force GeoJSON re-render
      })
      .catch((error) => console.error("Error loading GeoJSON:", error));
  }, [selection]);

  const onEachFeature = (feature: any, layer: L.Layer) => {
    if (selection === "Ward") {
      const { councillor, ward_num } = feature.properties;
      if (councillor && ward_num) {
        layer.bindPopup(`<b>Ward ${ward_num}</b> — ${councillor}`);
        layer.on("mouseover", () => layer.openPopup());
        layer.on("mouseout", () => layer.closePopup());
      }
    } else if (selection === "Electoral District") {
      const { councillor, label } = feature.properties;
      if (councillor && label) {
        layer.bindPopup(`<b>${label}</b> — ${councillor}`);
        layer.on("mouseover", () => layer.openPopup());
        layer.on("mouseout", () => layer.closePopup());
      }
    }
    // if we add constituency later, add interactions here
  };

  return (
    <div style={{ position: "relative", zIndex: 0 }}>
      <MapContainer
        center={[51.0447, -114.0719]}
        zoom={10.5}
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
            key={key}
            data={geoData}
            style={{
              color: "#200000",
              weight: 3,
              fillColor: "#eb4034",
              fillOpacity: 0.2,
            }}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
