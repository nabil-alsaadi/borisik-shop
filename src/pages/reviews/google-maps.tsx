import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { useCallback, useState } from 'react';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const mapOptions = {
  zoom: 10,
  disableDefaultUI: true, // Disable default map UI controls
};

export default function MyGoogleMap({ locations, onMarkerClick }: any) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY ?? "", // Replace with your Google Maps API Key
  });

  const [center, setCenter] = useState({
    lat: locations[0]?.lat || 0,
    lng: locations[0]?.lng || 0,
  });

  const handleMarkerClick = useCallback(
    (location: any) => {
      onMarkerClick(location);
    },
    [onMarkerClick]
  );

  if (!isLoaded) {
    return <div>Loading Map...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={mapOptions.zoom}
      options={mapOptions}
    >
      {locations.map((location: any, index: number) => (
        <Marker
          key={index}
          position={{ lat: location.lat, lng: location.lng }}
          onClick={() => handleMarkerClick(location)}
          title={location.name}
        />
      ))}
    </GoogleMap>
  );
}
