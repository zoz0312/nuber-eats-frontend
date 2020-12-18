import React, { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { RESTUARANT_FRAGMENT } from './../../fragments';
import { myRestaurants, myRestaurants_myRestaurants_restaurants } from './../../__generated__/myRestaurants';
import useScrollPage from './../../hooks/useScrollPage';
import { Helmet } from 'react-helmet-async';
import Restaurant from './../../components/Restaurant';
import { Link } from 'react-router-dom';
import Article from '../../components/Article';

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
  const { page, setTotalPages } = useScrollPage(1);
  const [itemList, setItemList] = useState<myRestaurants_myRestaurants_restaurants[]>([]);
  const { data, loading } = useQuery<myRestaurants>(MY_RESTAURANTS_QUERY, {
    variables: {
      input: {
        page,
      }
    },
    fetchPolicy: "network-only"
  });

  useEffect(() => {
    if (data && data.myRestaurants.restaurants) {
      const { myRestaurants: { restaurants, totalPages } } = data;
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
        <title>My Restaurants | Nuber Eats</title>
      </Helmet>
      <Article loading={loading}>
        <h2 className="text-4xl mb-10">My Restaurants</h2>
        <button className="btn mr-5">
          <Link className="text-white" to="/edit-category">
            Edit Category
          </Link>
        </button>
        <button className="btn">
          <Link className="text-white" to="/add-restaurant">
            Create Restaurant
          </Link>
        </button>
        { itemList.length === 0 ? (
          <>
            <h4 className="text-xl mb-5">나의 가게가 없습니다!</h4>
          </>
        ) : (
          <div className="grid md:grid-cols-3 gap-x-5 gap-y-10 pb-10 mt-10 mb-10">
            { itemList.map(restaurant => (
              <Restaurant
                key={restaurant.id}
                id={restaurant.id}
                coverImage={restaurant.coverImage}
                name={restaurant.name}
                categoryName={restaurant.category?.name || ''}
              />
            ))}
          </div>
        )}
      </Article>
    </div>
  )
};

export default MyRestaurants;