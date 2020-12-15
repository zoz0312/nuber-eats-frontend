import React, { useEffect, useState } from 'react';
import { gql, useSubscription, useMutation } from '@apollo/client';
import { FULL_ORDER_FRAMGENT } from './../../fragments';
import { cookedOrders } from './../../__generated__/cookedOrders';
import { Link, useHistory } from 'react-router-dom';
import { takeOrder, takeOrderVariables } from './../../__generated__/takeOrder';
import GoogleMapReact from 'google-map-react';

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

const COOKED_ORDERS_SUBSCRIPTION = gql`
  subscription cookedOrders {
    cookedOrders {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAMGENT}
`;

const TAKE_ORDER_MUTATION = gql`
  mutation takeOrder($input: TakeOrderInput!) {
    takeOrder(input: $input) {
      ok
      error
    }
  }
`;

const Driver: React.FC<IDriverProps> = () => <div className="text-lg">🛵</div>;
const Destination: React.FC<IDriverProps> = () => <div className="text-lg">🍔</div>;

const DashBoard: React.FC = () => {
  const [map, setMap] = useState<any>();
  const [maps, setMaps] = useState<any>();
  const [driverCoords, setDriverCoords] = useState<ICoords>({
    lat: 0,
    lng: 0,
  });

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
    if (map && maps) {
      map.panTo(new maps.LatLng(driverCoords.lat, driverCoords.lng));
    }
  }, [driverCoords.lat, driverCoords.lng]);

  const onApiLoaded = ({ map, maps } : { map: any, maps: any }) => {
    map.panTo(new maps.LatLng(driverCoords.lat, driverCoords.lng));
    setMap(map);
    setMaps(maps);
  };

  const makeRoute = () => {
    if (map) {
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({
        polylineOptions: {
          strokeColor: "#000",
          strokeOpacity: 1,
          strokeWeight: 5,
        },
      });
      directionsRenderer.setMap(map);
      directionsService.route(
        {
          origin: {
            location: new google.maps.LatLng(
              driverCoords.lat,
              driverCoords.lng
            ),
          },
          destination: {
            location: new google.maps.LatLng(
              driverCoords.lat + 0.005,
              driverCoords.lng + 0.005
            ),
          },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result) => {
          directionsRenderer.setDirections(result);
        }
      );
    }
  };

  const onGetRouteClick = () => {
    // window.open('https://map.kakao.com/link/to/도착지,37.402056,127.108212');
    makeRoute();
  };

  const { data: cookedOrdersData } = useSubscription<cookedOrders>(COOKED_ORDERS_SUBSCRIPTION);

  useEffect(() => {
    if (cookedOrdersData?.cookedOrders.id) {
      // render map
      // makeRoute();
    }
  }, []);

  const history = useHistory();
  const onCompleted = (data: takeOrder) => {
    if (data.takeOrder.ok) {
      history.push(`/orders/${cookedOrdersData?.cookedOrders.id}`);
    }
  }
  const [takeOrderMutation] = useMutation<
    takeOrder,
    takeOrderVariables
  >(TAKE_ORDER_MUTATION, {
    onCompleted
  });

  const triggerMutation = (id: number) => {
    takeOrderMutation({
      variables: {
        input: {
          id
        }
      }
    })
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
        {/* <div id="kakao_map" className="w-full h-full"></div> */}
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
          <Driver lat={driverCoords.lat} lng={driverCoords.lng} />
          <Destination lat={driverCoords.lat+0.005} lng={driverCoords.lng+0.005} />
        </GoogleMapReact>
      </div>
      <button onClick={onGetRouteClick}>도착지 길찾기</button>

      { cookedOrdersData?.cookedOrders ? (
      <>
        <div className="max-w-screen-sm mx-auto bg-white shadow-lg py-8 px-5">
          <h1 className="text-center text-3xl">New Cooked Order</h1>
          <h2 className="text-center text-xl py-4">
            {cookedOrdersData.cookedOrders.restaurant?.name}
          </h2>
          <button
            onClick={() => { triggerMutation(cookedOrdersData?.cookedOrders.id) }}
            className="btn w-full"
          >배달하기 &rarr;</button>
        </div>
      </>
      ) : (
        <h1 className="text-center text-2xl mt-5">아직 주문이 없습니다!</h1>
      )}
    </>
  );
}

export default DashBoard;
