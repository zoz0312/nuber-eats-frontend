import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { Link, useParams } from 'react-router-dom';
import { RESTUARANT_FRAGMENT, DISH_FRAGMENT } from './../../fragments';
import { myRestaurant, myRestaurantVariables } from './../../__generated__/myRestaurant';
import { Helmet } from 'react-helmet-async';
import Article from '../../components/Article';
import Dish from './../../components/Dish';

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
      }
    }
  }
  ${RESTUARANT_FRAGMENT}
  ${DISH_FRAGMENT}
`;

interface IParams {
  id: string;
}

const MyRestaurant: React.FC = () => {
  const { id } = useParams<IParams>();
  const { data, loading } = useQuery<
    myRestaurant,
    myRestaurantVariables
  >(MY_RESTAURANT_QUERY, {
    variables: {
      input: {
        id: +id,
      }
    }
  });

  return (
    <div>
      <Helmet>
        {`My Restaurant | Nuber Eats`}
      </Helmet>
      <header>
        <div
          className="bg-gray-700 py-28 bg-cover bg-center"
          style={{
            backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImage})`
          }}
        >
        </div>
      </header>
      <Article loading={loading}>
        <div className="text-4xl font-medium mb-10">
          {data?.myRestaurant.restaurant?.name}
        </div>
        <div className="my-3">
          <Link
            to={`/restaurant/${id}/add-dish`}
            className="mr-8 text-white bg-gray-800 py-3 px-10"
          >Add Dish &rarr;</Link>
          <Link
            to={``}
            className="text-white bg-lime-700 py-3 px-10"
          >Buy Promition &rarr;</Link>
        </div>
        <div className="mt-10">
          {data?.myRestaurant.restaurant?.menu.length === 0 ? (
            <div className="text-xl mb-5">You have no dishies</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-x-7 gap-y-4">
            { data?.myRestaurant.restaurant?.menu.map((dish, index) => (
              <Dish key={index} menu={dish} />
            ))}
            </div>
          )}
        </div>
        <div className="mt-20">
          <h4 className="text-center text-xl font-medium">Sales</h4>
          <div className="max-w-sm w-full ">

          </div>
        </div>
      </Article>
    </div>
  );
};

export default MyRestaurant;
