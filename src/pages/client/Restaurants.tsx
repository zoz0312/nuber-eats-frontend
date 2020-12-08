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

const defaultCategoryImage = 'https://www.nicepng.com/png/full/131-1314271_food-icon-food-court-icon-png.png';
const defaultRestaurantImage = 'https://www.bbq.co.kr/images/common/logo_header_bbq.png';

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
              <div className="w-16 flex flex-col items-center group">
                <div
                  key={index}
                  style={{backgroundImage: `url(${category.coverImage ? category.coverImage : defaultCategoryImage})`}}
                  className="w-16 h-16 rounded-full bg-cover group-hover:bg-gray-100 cursor-pointer">
                </div>
                <span className="mt-1 text-sm text-center font-bold break-all">{ category.name }</span>
              </div>
            ))}
            </div>
            <div className="grid grid-cols-3 gap-x-5 gap-y-10 mt-10">
              {data?.restaurants.results?.map((restaurant, index) => (
                <div key={index}>
                  <div
                    style={{backgroundImage:`url(${restaurant.coverImage ? restaurant.coverImage : defaultRestaurantImage})`}}
                    className="bg-red-500 py-28 bg-cover bg-center mb-2"></div>
                  <h3 className="text-xl font-semibold">{ restaurant.name }</h3>
                  <span className="border-t-2 border-lime-500">{ restaurant.category?.name }</span>
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
