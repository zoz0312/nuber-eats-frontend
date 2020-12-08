import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { useParams } from 'react-router-dom';
import { RESTUARANT_FRAGMENT } from '../../fragments';
import { restaurant, restaurantVariables } from '../../__generated__/restaurant';
import { Helmet } from 'react-helmet';

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
      <Helmet>
        <title>{ data?.restaurant.restaurant?.name } | Nuber Eats</title>
      </Helmet>
      <div
        className="bg-gray-800 py-32 bg-cover bg-center"
        style={{backgroundImage: `url(${data?.restaurant.restaurant?.coverImage})`}}
      >
        <div className="bg-white w-1/4 py-8 px-10">
          <h4 className="text-3xl mb-3">{ data?.restaurant.restaurant?.name }</h4>
          <h5 className="text-sm mb-3 font-light">{ data?.restaurant.restaurant?.category?.name }</h5>
          <h6 className="text-sm font-light">{ data?.restaurant.restaurant?.address }</h6>
        </div>
      </div>
    </div>
  );
}

export default ClientRestaurant;
