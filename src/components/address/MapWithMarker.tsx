import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { useCallback, useRef, useState } from 'react';
interface MarkerPosition {
    lat: number;
    lng: number;
}
const libraries: any = ['places'];
export default function MapWithMarker({marker,setMarker}: any) {
    // const { isLoaded, loadError } = useLoadScript({
    //     googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY!, 
    //     libraries,
    // });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const mapRef = useRef(null);
    const defaultLocation: MarkerPosition = {
    lat: (marker as any)?.lat || 25.276987,
    lng: (marker as any)?.lng || 55.296249,
    };
    
    const handleMapClick = (event: google.maps.MapMouseEvent) => {
        if (event?.latLng?.lat() && event?.latLng?.lng()) {
            setMarker({
                lat: event?.latLng.lat(),
                lng: event?.latLng.lng(),
            });
        }
        
    };

    const onLoad = useCallback((map: any) => {
        mapRef.current = map;
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const newLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              setMarker(newLocation);
              map.panTo(newLocation); // Move the map to the new location
              map.setZoom(14); // Optional: Zoom closer to the current location
            },
            (error) => {
              console.error("Error getting current location:", error);
              setErrorMessage("Unable to retrieve your location. Please enable location access.");
            }
          );
        } else {
          console.error("Geolocation is not supported by this browser.");
          setErrorMessage("Geolocation is not supported by this browser.");
        }
      }, []);

      const panToCurrentLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const newLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              setMarker(newLocation);
              if (mapRef?.current) {
                //@ts-ignore
                mapRef.current.panTo(newLocation);
                //@ts-ignore
                mapRef.current.setZoom(14);
              }
              
            },
            (error) => {
              console.error("Error getting current location:", error);
              setErrorMessage("Unable to retrieve your location. Please enable location access.");
            }
          );
        }
      };
    //   if (loadError) {
    //     return <div>Error loading maps</div>;
    //   }
    //   if (!isLoaded) {
    //     return <div>Loading Maps...</div>;
    //   }
    return (
    <div className="relative w-full h-[60vh]">
        {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded absolute z-20 top-0 left-0 right-0" role="alert">
          <span className="block sm:inline">{errorMessage}</span>
        </div>
        )}
        <GoogleMap
        center={defaultLocation}
        zoom={12}
        mapContainerClassName="w-full h-full"
        onClick={handleMapClick}
        onLoad={onLoad}
        options={{
            zoomControl: true, // Zoom control enabled
            streetViewControl: false, // Street View control enabled
            mapTypeControl: false, // Map Type control enabled
            fullscreenControl: true, // Fullscreen control enabled
        }}
        >
            <button
                onClick={panToCurrentLocation}
                className="absolute bottom-5 left-5 h-14 w-14 bg-white border-2 border-gray-300 rounded-full shadow-md shadow-gray-500 cursor-pointer z-10"
            >
                📍
            </button>
        <Marker position={defaultLocation} draggable onDragEnd={handleMapClick} />
        </GoogleMap>
    </div>
    
    );
}