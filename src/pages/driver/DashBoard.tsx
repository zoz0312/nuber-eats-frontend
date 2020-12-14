import React, { useEffect, useState } from 'react';

interface ICoords {
  lat: number;
  lng: number;
}

interface IDriverProps {
  lat: number;
  lng: number;
  $hover?: any;
};

declare global {
  interface Window {
    kakao: any;
  }
};

const Driver:React.FC<IDriverProps> = () => <div className="text-lg">🛵</div>

const DashBoard: React.FC = () => {
  const [driverCoords, setDriverCoords] = useState<ICoords>({
    lat: 0,
    lng: 0,
  });
  const [map, setMap] = useState<google.maps.Map>();
  const [maps, setMaps] = useState<any>();

  const onSuccess = ({coords: { latitude, longitude }}: any) => {
    setDriverCoords({
      lat: latitude,
      lng: longitude,
    });
  };

  const onError = (error: any) => {
    console.log(error)
  };

  useEffect(() => {
    navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
    });
  }, []);

  useEffect(() => {
    if (driverCoords) {
      const { kakao: { maps } } = window;
      const startlatlng = new maps.LatLng(driverCoords.lat, driverCoords.lng);
      const endLatLng = new maps.LatLng(driverCoords.lat, driverCoords.lng + 0.0005);

      let container = document.getElementById('kakao_map');

      let options = {
        center: new maps.LatLng(driverCoords.lat, driverCoords.lng),
        level: 5,
      };

      const map = new maps.Map(container, options);
      const startMarker = new maps.Marker({
        position: startlatlng,
      });
      const endMarker = new maps.Marker({
        position: endLatLng,
      });

      startMarker.setMap(map);
      endMarker.setMap(map);

      const startInfoWindow = new maps.InfoWindow({
        position : startMarker,
        content: `<div>출발</div>`,
      });
      startInfoWindow.open(map, startMarker);

      const endInfoWindow = new maps.InfoWindow({
        position : endMarker,
        content: `<div>도착</div>`,
      });
      endInfoWindow.open(map, endMarker);

      map.setCenter(startlatlng);
    }
  }, [driverCoords]);


  const onGetRouteClick = () => {
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
        <div id="kakao_map" className="w-full h-full"></div>
      </div>
      <button onClick={onGetRouteClick}>Get Route</button>
    </>
  );
}

export default DashBoard;
