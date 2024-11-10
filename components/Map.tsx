"use client";
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const Map: React.FC = () => {
  const [geoData, setGeoData] = useState(null);

  const handleMarkerClick = ({ name }: { name: string }) => {
    if (name === "Calgary Center") {
      alert("Calgary Center");
    }
  };

  // MP data
  const mpData = [
    {
      name: "Calgary Center",
      position: [51.05011, -114.08529] as [number, number],
      district: "Calgary-Center",
    },
    {
      name: "Calgary-North",
      position: [51.0447, -114.0719] as [number, number],
      district: "Calgary-North",
    },
    {
      name: "Calgary-West",
      position: [51.0285, -114.1307] as [number, number],
      district: "Calgary-West",
    },
  ];

  // get geojson
  useEffect(() => {
    fetch("/Wards.geojson")
      .then((response) => response.json())
      .then((data) => setGeoData(data))
      .catch((error) => console.error("Error loading GeoJSON:", error));
  }, []);

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
        key="map"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {/* render geojson component after geodata is fetched */}
        {geoData && (
          <GeoJSON
            data={geoData}
            style={{
              color: "#eb4034",
              weight: 3,
              fillColor: "#eb4034",
              fillOpacity: 0.2,
            }}
          />
        )}

        {/* Markers */}
        {mpData.map((mp, index) => (
          <Marker
            key={index}
            position={mp.position}
            eventHandlers={{ click: () => handleMarkerClick({ name: mp.name }) }}
          >
            <Popup>
              <strong>{mp.name}</strong>
              <br />
              {mp.district}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
