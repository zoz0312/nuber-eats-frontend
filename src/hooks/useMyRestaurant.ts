
import { gql, useQuery } from '@apollo/client';
import { RESTUARANT_FRAGMENT, DISH_FRAGMENT, ORDERS_FRAGMENT } from './../fragments';
import { myRestaurant, myRestaurantVariables } from './../__generated__/myRestaurant';

export const MY_RESTAURANT_QUERY = gql`
  query myRestaurant($input: MyRestaurantInput!) {
    myRestaurant(input:$input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
        orders {
          ...OrderParts
        }
      }
    }
  }
  ${RESTUARANT_FRAGMENT}
  ${DISH_FRAGMENT}
  ${ORDERS_FRAGMENT}
`;

export const useMyRestaurant = (id: number) => {
  return useQuery<
    myRestaurant,
    myRestaurantVariables
  >(MY_RESTAURANT_QUERY, {
      variables: {
        input: {
          id,
        }
      }
    }
  );
}