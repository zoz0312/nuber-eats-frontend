import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { Link, useParams } from 'react-router-dom';
import { RESTUARANT_FRAGMENT } from './../../fragments';
import { myRestaurant, myRestaurantVariables } from './../../__generated__/myRestaurant';
import { Helmet } from 'react-helmet-async';
import Article from '../../components/Article';

const MY_RESTAURANT_QUERY = gql`
  query myRestaurant($input: MyRestaurantInput!) {
    myRestaurant(input:$input) {
      ok
      error
      restaurant {
        ...RestaurantParts
      }
    }
  }
  ${RESTUARANT_FRAGMENT}
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
      <header>
        <div
          className="bg-gray-700 py-28 bg-cover bg-center"
          style={{
            backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImage})`
          }}
        >
        </div>
      </header>
      <Article
        title="My Restaurant"
        loading={loading}
      >
        <div className="text-4xl font-medium mb-10">
          {data?.myRestaurant.restaurant?.name}
        </div>
        <Link
          to={``}
          className="mr-8 text-white bg-gray-800 py-3 px-10"
        >Add Dish &rarr;</Link>
        <Link
          to={``}
          className="text-white bg-lime-700 py-3 px-10"
        >Buy Promition &rarr;</Link>
      </Article>
    </div>
  );
};

export default MyRestaurant;
