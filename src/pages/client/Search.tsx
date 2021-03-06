import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { gql, useQuery } from '@apollo/client';
import { RESTUARANT_FRAGMENT } from '../../fragments';
import { searchRestaurant, searchRestaurantVariables, searchRestaurant_searchRestaurant_restaurants } from '../../__generated__/searchRestaurant';
import Restaurant from '../../components/Restaurant';
import useScrollPage from '../../hooks/useScrollPage';
import Article from '../../components/Article';

export const SEARCH_RESTAURANT = gql`
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
  const query = location.search.split('?term=')[1];
  const [itemList, setItemList] = useState<searchRestaurant_searchRestaurant_restaurants[]>([]);
  const { page, setTotalPages } = useScrollPage(1);
  const { loading, data } = useQuery<
    searchRestaurant,
    searchRestaurantVariables
  >(SEARCH_RESTAURANT,{
    variables: {
      input: {
        page,
        query,
      }
    },
    fetchPolicy: "network-only"
  });

  useEffect(() => {
    if (!query) {
      return history.replace('/');
    }
  }, [history, location, query]);

  useEffect(() => {
    if (data && data.searchRestaurant.restaurants) {
      const { searchRestaurant: { restaurants, totalPages } } = data;
      setTotalPages(totalPages);
      if (restaurants) {
        setItemList([
          ...itemList,
          ...restaurants,
        ]);
      }
    }
  }, [data]);

  return (
    <div>
      <Helmet>
        <title>Search | Nuber Eats</title>
      </Helmet>
      <header className="bg-gray-200 w-screen py-10 text-center">
        <h4 className="text-3xl">{ query } / {`${data?.searchRestaurant.totalResults} Restaurants`}</h4>
      </header>
      <Article loading={loading}>
        <div className="grid md:grid-cols-3 gap-x-5 gap-y-10 pb-10 mt-10 mb-10">
          {itemList.map(restaurant => (
            <Restaurant
              key={restaurant.id}
              id={restaurant.id}
              coverImage={restaurant.coverImage}
              name={restaurant.name}
              categoryName={restaurant.category?.name || ''}
            />
          ))}
        </div>
      </Article>
    </div>
  );
}

export default ClientSearch;
