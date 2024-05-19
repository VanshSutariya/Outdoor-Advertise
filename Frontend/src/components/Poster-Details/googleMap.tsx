import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "1240px",
  height: "300px",
  borderRadius: "20px",
  overflow: "hidden",
  border: "2px ",
};
interface GoogleMapsProps {
  latitude: number;
  longitude: number;
}

const GoogleMaps: React.FC<GoogleMapsProps> = ({ latitude, longitude }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: `${process.env.GMAPS_KEY}`,
  });
  const center = {
    lat: latitude,
    lng: longitude,
  };

  return isLoaded ? (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
      <Marker position={center} />
    </GoogleMap>
  ) : (
    <></>
  );
};

export default GoogleMaps;
