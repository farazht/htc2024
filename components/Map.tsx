"use client";
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Map: React.FC = () => {
  const handleMarkerClick = ({ name }: { name: string }) => {
    switch (name) {
      case "Calgary Center":
        alert("Calgary Center");
    }
  };

  const mpData: {
    name: string;
    position: [number, number];
    district: string;
  }[] = [
    {
      name: "Calgary Center",
      position: [51.05011, -114.08529],
      district: "Calgary-Center",
    },
    {
      name: "Calgary-North",
      position: [51.0447, -114.0719],
      district: "Calgary-North",
    },
    {
      name: "Calgary-West",
      position: [51.0285, -114.1307],
      district: "Calgary-West",
    },
  ];

  return (
    <MapContainer
      center={[51.0447, -114.0719]}
      zoom={11}
      style={{ height: "100vh", width: "100%" }}
      zoomControl={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      dragging={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
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
  );
};

export default Map;
