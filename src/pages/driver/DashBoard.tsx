import React, { useEffect, useState } from 'react';
import { gql, useSubscription, useMutation } from '@apollo/client';
import { FULL_ORDER_FRAMGENT } from './../../fragments';
import { cookedOrders } from './../../__generated__/cookedOrders';
import { Link, useHistory } from 'react-router-dom';
import { takeOrder, takeOrderVariables } from './../../__generated__/takeOrder';

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

const DashBoard: React.FC = () => {
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
    window.open('https://map.kakao.com/link/to/도착지,37.402056,127.108212')
  };

  const { data: cookedOrdersData } = useSubscription<cookedOrders>(COOKED_ORDERS_SUBSCRIPTION);

  useEffect(() => {
    if (cookedOrdersData?.cookedOrders.id) {
      //render map
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
        <div id="kakao_map" className="w-full h-full"></div>
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
