import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { RESTUARANT_FRAGMENT } from './../../fragments';
import { myRestaurants } from './../../__generated__/myRestaurants';

const MY_RESTAURANTS_QUERY = gql`
  query myRestaurants($input: MyRestaurantsInput!) {
    myRestaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTUARANT_FRAGMENT}
`;

const MyRestaurants: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data } = useQuery<myRestaurants>(MY_RESTAURANTS_QUERY, {
    variables: {
      input: {
        page,
      }
    }
  });

  console.log('data', data)
  return (
    <div>MyRestaurants</div>
  )
};

export default MyRestaurants;