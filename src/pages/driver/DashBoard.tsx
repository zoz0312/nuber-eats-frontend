import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';

interface ICoords {
  lat: number;
  lng: number;
}

const DashBoard: React.FC = () => {
  const [driverCoords, setDriverCoords] = useState<ICoords>({
    lat: 0,
    lng: 0,
  });
  const [map, setMap] = useState<any>();
  const [maps, setMaps] = useState<any>();

  const onSuccess = ({coords: { latitude, longitude }}: any) => {
    setDriverCoords({
      lat: latitude,
      lng: longitude,
    })
  };

  const onError = (error: any) => {
    console.log(error)
  };

  useEffect(() => {
    navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
    })
  }, []);

  useEffect(() => {
    if (map && maps) {
      map.panTo(new maps.LatLng(driverCoords.lat, driverCoords.lng));
    }
  }, [driverCoords.lat, driverCoords.lng])

  const onApiLoaded = ({ map, maps } : { map: any, maps: any }) => {
    map.panTo(new maps.LatLng(driverCoords.lat, driverCoords.lng));
    setMap(map);
    setMaps(maps);
  }

  return (
    <>
      <div
        className="overflow-hidden"
        style={{
          width: window.innerWidth,
          height: '50vh'
        }}
      >
        <GoogleMapReact
          defaultZoom={16}
          defaultCenter={{
            lat: 59.95,
            lng: 30.33
          }}
          yesIWantToUseGoogleMapApiInternals
          bootstrapURLKeys={{ key: 'AIzaSyAyZ_C6r2BN4OStlSdiid-nU_S-hirSxMU' }}
          onGoogleApiLoaded={onApiLoaded}
        >
          <div className="text-lg">
            🛵
          </div>
        </GoogleMapReact>
      </div>
    </>
  );
}

export default DashBoard;
