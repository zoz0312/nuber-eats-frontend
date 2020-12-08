import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { gql, useLazyQuery } from '@apollo/client';
import { RESTUARANT_FRAGMENT } from '../../fragments';
import { searchRestaurant, searchRestaurantVariables } from '../../__generated__/searchRestaurant';

const SEARCH_RESTAURANT = gql`
  query searchRestaurant($input: SearchRestaurantInput!) {
    searchRestaurant(input: $input) {
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

const ClientSearch: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const [startQuery, { loading, data }] = useLazyQuery<
    searchRestaurant,
    searchRestaurantVariables
  >(SEARCH_RESTAURANT);

  useEffect(() => {
    const query = location.search.split('?term=')[1];
    if (!query) {
      return history.replace('/');
    }
    startQuery({
      variables: {
        input: {
          page: 1,
          query,
        }
      }
    });
  }, [history, location]);

  return (
    <div>
      <Helmet>
        <title>Search | Nuber Eats</title>
      </Helmet>
    </div>
  );
}

export default ClientSearch;
