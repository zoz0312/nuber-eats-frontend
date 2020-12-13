import { gql, useQuery, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
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
      orderId
    }
  }
`;

interface IRestaruantParams {
  id: string;
};

interface IOptionChoice {
  id: number;
  optionName: string;
  choice: {
    name: string;
    extra?: number | null;
  }
};

const ClientRestaurant: React.FC = () => {
  const history = useHistory();
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
  const [optionChoices, setOptionChoices] = useState<IOptionChoice[]>([]);
  const triggerStartOrder = () => {
    setIsOrderStarted(true);
  };

  const isSelected = (dishId: number) => {
    return Boolean(getItem(dishId));
  };

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
    setOptionChoices(current =>
      current.filter(item =>
        item.id !== dishId
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
      const hasOption = Boolean(
        oldItem.options?.find(oldOption => oldOption.name === option.name)
      );

      removeOrederItem(dishId);
      if (hasOption) {
        const filteredOptions = oldItem.options?.filter(oldOption => oldOption.name !== option.name);
        setOrderItems(current => [
          {
            dishId,
            options: filteredOptions,
          },
          ...current
        ]);

        setOptionChoices(current =>
          current.filter(item =>
            item.optionName !== option.name
          )
        );
      } else {
        setOrderItems(current => [
          {
            dishId,
            options: [
              option,
              ...oldItem.options!,
            ]
          },
          ...current
        ]);
      }
    }
  };

  const getOptionFromItem = (item: CreateOrderItemInput, optionName: string) => {
    return item.options?.find(option => option.name === optionName);
  };

  const isOptionSelected = (dishId: number, optionName: string) => {
    const item = getItem(dishId);
    if (item) {
      return Boolean(getOptionFromItem(item, optionName))
    }
    return false;
  };

  const getChoice = (
    dishId: number,
    optionName: string,
    choice: { name: string }
  ) => {
    return optionChoices.find(item => {
      return (item.id === dishId
        && item.optionName === optionName
        && item.choice.name === choice.name)
    });
  };

  const choiceItemHandle = (
    dishId: number,
    optionName: string,
    choice: { name: string, extra?: number }
  ) => {
    if (!isSelected(dishId)) {
      return;
    }

    const oldItem = getItem(dishId);
    if (oldItem) {
      const hasOption = Boolean(
        oldItem.options?.find(oldOption => oldOption.name === optionName)
      );

      if (!hasOption) {
        return;
      }
    }

    const isChoice = optionChoices.find(item =>
      (item.id === dishId && item.optionName === optionName)
    );

    if (isChoice) {
      setOptionChoices(current =>
        current.filter(item =>
          item.optionName !== optionName
        )
      );
    }
    setOptionChoices(current => [
      {
        id: dishId,
        optionName,
        choice: { ...choice }
      },
      ...current
    ]);
  };

  const isChoiceSelected = (
    dishId: number,
    optionName: string,
    choice: { name: string, extra?: number }
  ) => {
    const isChoice = getChoice(dishId, optionName, choice);
    if (isChoice) {
      return Boolean(isChoice);
    }
    return false;
  };

  const triggerCancleOrder = () => {
    setIsOrderStarted(false);
    setOrderItems([]);
    setOptionChoices([]);
  };

  const onCompleted = (data: createOrder) => {
    const { createOrder: { ok, orderId } } = data;
    if (ok) {
      history.push(`/orders/${orderId}`);
    }
  };

  const [makeOrderMutation, { loading: placingOrder }] = useMutation<
    createOrder,
    createOrderVariables
  >(CREATE_ORDER_MUTATION, {
    onCompleted
  });

  const triggerConfirmOrder = () => {
    if (orderItems.length === 0) {
      alert('주문할 항목을 선택해주세요!');
      return;
    } else {
      // option -> choice cheking
      makeOrderMutation({
        variables: {
          input: {
            restaurantId: +params.id,
            items: orderItems,
          }
        }
      });
    }

    const ok = window.confirm('정말 주문 하시겠습니까?');
    if (ok) {
      // mutation
    }
  }

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
            <div
              className="flex items-center"
            >
              { !isOrderStarted && (
                <button type="button" className="btn my-5" onClick={triggerStartOrder}>
                  주문하기
                </button>
              )}
              { isOrderStarted && (<>
                <button type="button" className="btn my-5 mr-3" onClick={triggerConfirmOrder}>
                  결재하기
                </button>
                <button type="button" className="btn-black my-5" onClick={triggerCancleOrder}>
                  주문취소
                </button>
              </>)}
            </div>
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
                  isOptionSelected={isOptionSelected}
                  choiceItemHandle={choiceItemHandle}
                  isChoiceSelected={isChoiceSelected}
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
