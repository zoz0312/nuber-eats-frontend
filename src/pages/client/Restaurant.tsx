import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { useParams } from 'react-router-dom';
import { RESTUARANT_FRAGMENT } from '../../fragments';
import { restaurant, restaurantVariables } from '../../__generated__/restaurant';

const RESTAURANT_QUERY = gql`
  query restaurant($input: RestaurantInput!) {
    restaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
      }
    }
  }
  ${RESTUARANT_FRAGMENT}
`;

interface IRestaruantParams {
  id: string;
}

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

  return (
    <div>

    </div>
  );
}

export default ClientRestaurant;
