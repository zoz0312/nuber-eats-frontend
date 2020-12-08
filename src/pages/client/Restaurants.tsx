import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { restaurantsPageQuery, restaurantsPageQueryVariables } from '../../__generated__/restaurantsPageQuery';

const RESTAURANTS_QUERY = gql`
  query restaurantsPageQuery($input: RestaurantsInput!) {
    allcategories {
      ok
      error
      categories {
        id
        name
        coverImage
        slug
        restaurantCount
      }
    }
    restaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      results {
        id
        name
        coverImage
        category {
          name
        }
        address
        isPromoted
      }
    }
  }
`;

const defaultImageURL = 'https://www.nicepng.com/png/full/131-1314271_food-icon-food-court-icon-png.png';

const Restaurants: React.FC = () => {
  const { data, loading, error } = useQuery<
    restaurantsPageQuery,
    restaurantsPageQueryVariables
  >(RESTAURANTS_QUERY, {
    variables: {
      input: {
        page: 1,
      }
    }
  });

  console.log('data', data);

  return (
    <div>
      <form className="bg-gray-800 w-full py-40 flex items-center justify-center">
        <input
          type="Search"
          className="input w-3/12 rounded-md border-0"
          placeholder="Search restaurats..." />
      </form>
      <div>
        {!loading && (
          <div className="max-x-screen-2xl mx-auto mt-8">
            <div className="flex justify-around max-w-xs mx-auto">
            {data?.allcategories.categories?.map((category, index) => (
              <div className="w-14 flex flex-col items-center">
                <div
                  key={index}
                  style={{backgroundImage: `url(${category.coverImage ? category.coverImage : defaultImageURL})`}}
                  className="w-14 h-14 rounded-full bg-cover hover:bg-gray-100 cursor-pointer">
                </div>
                <span className="mt-1 text-sm text-center font-bold break-all">{ category.name }</span>
              </div>
            ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Restaurants;
