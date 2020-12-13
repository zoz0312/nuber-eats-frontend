import { gql, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { RESTUARANT_FRAGMENT } from '../../fragments';
import { restaurant, restaurantVariables } from '../../__generated__/restaurant';
import { Helmet } from 'react-helmet';
import Dish from '../../components/Dish';
import Article from '../../components/Article';
import { DISH_FRAGMENT } from './../../fragments';
import { createOrder, createOrderVariables } from './../../__generated__/createOrder';
import { CreateOrderItemInput } from '../../__generated__/globalTypes';
import { restaurant_restaurant_restaurant_menu_options } from './../../__generated__/restaurant';

export const RESTAURANT_QUERY = gql`
  query restaurant($input: RestaurantInput!) {
    restaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
      }
    }
  }
  ${RESTUARANT_FRAGMENT}
  ${DISH_FRAGMENT}
`;

export const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      ok
      error
    }
  }
`;

interface IRestaruantParams {
  id: string;
};

const ClientRestaurant: React.FC = () => {
  const params = useParams<IRestaruantParams>();
  const { loading, data } = useQuery<
    restaurant,
    restaurantVariables
  >(RESTAURANT_QUERY, {
    variables: {
      input: {
        restaurantId: +params.id,
      }
    }
  });

  const [isOrderStarted, setIsOrderStarted] = useState(false);
  const [orderItems, setOrderItems] = useState<CreateOrderItemInput[]>([]);
  const triggerStartOrder = () => {
    setIsOrderStarted(true);
  };

  const isSelected = (dishId: number) => {
    return Boolean(getItem(dishId));
  }

  const getItem = (dishId: number) => {
    return orderItems.find(order => order.dishId === dishId);
  };

  const addOrderItem = (dishId: number) => {
    setOrderItems(current => [
      { dishId, options: [] },
      ...current
    ]);
  };

  const removeOrederItem = (dishId: number) => {
    setOrderItems(current =>
      current.filter(dish =>
        dish.dishId !== dishId
      )
    );
  };

  const orderItemHandle = (dishId: number) => {
    if (isSelected(dishId)) {
      removeOrederItem(dishId);
    } else {
      addOrderItem(dishId);
    }
  };

  const optionItemHandle = (
    dishId: number,
    option: restaurant_restaurant_restaurant_menu_options,
  ) => {
    if (!isSelected(dishId)) {
      return;
    }
    const oldItem = getItem(dishId);
    if (oldItem) {
      removeOrederItem(dishId);
      setOrderItems(current => [
        {
          dishId,
          options: [
            option,
            ...oldItem.options!,
          ]
        },
      ]);
    }
  }

  console.log('orderItems', orderItems)

  return (
    <div>
      <Helmet>
        {`${data?.restaurant.restaurant?.name} | Nuber Eats`}
      </Helmet>
      <header
        className="bg-gray-800 py-32 bg-cover bg-center"
        style={{backgroundImage: `url(${data?.restaurant.restaurant?.coverImage})`}}
      >
        <div className="bg-white w-1/4 py-8 px-10">
          <h4 className="text-3xl mb-3">{ data?.restaurant.restaurant?.name }</h4>
          <h5 className="text-sm mb-3 font-light">{ data?.restaurant.restaurant?.category?.name }</h5>
          <h6 className="text-sm font-light">{ data?.restaurant.restaurant?.address }</h6>
        </div>
      </header>
      <Article loading={loading}>
        { data?.restaurant.restaurant?.menu.length !== 0 ? (
          <div className="flex flex-col items-end pb-32">
            <button type="button" className="btn my-5" onClick={triggerStartOrder}>
              { isOrderStarted ? '장바구니 담는중..' : '주문하기' }
            </button>
            <div className="grid md:grid-cols-3 gap-x-7 gap-y-4 w-full">
              {data?.restaurant.restaurant?.menu.map((menu, index) => (
                <Dish
                  key={index}
                  isSelected={isSelected(menu.id)}
                  menu={menu}
                  isCustomer={true}
                  orderStarted={isOrderStarted}
                  orderItemHandle={orderItemHandle}
                  optionItemHandle={optionItemHandle}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-2xl">메뉴가 없습니다.</div>
        )}
      </Article>
    </div>
  );
}

export default ClientRestaurant;
