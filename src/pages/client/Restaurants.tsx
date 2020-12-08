import { gql, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { restaurantsPageQuery, restaurantsPageQueryVariables } from '../../__generated__/restaurantsPageQuery';
import Restaurant from '../../components/Restaurant';

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
  const [page, setPage] = useState(1);
  const { data, loading, error } = useQuery<
    restaurantsPageQuery,
    restaurantsPageQueryVariables
  >(RESTAURANTS_QUERY, {
    variables: {
      input: {
        page,
      }
    }
  });

  const onNextPageClick = () => setPage(current => current + 1);
  const onPrevPageClick = () => setPage(current => current - 1);

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
          <div className="max-w-screen-2xl mx-auto mt-8 pb-20">
            <div className="flex justify-around max-w-sm mx-auto">
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
                <Restaurant
                  key={index}
                  coverImage={restaurant.coverImage}
                  name={restaurant.name}
                  categoryName={restaurant.category?.name}
                />
              ))}
            </div>
            <div className="grid grid-cols-3 text-center max-w-md mx-auto items-center">
              { 1 < page ? (
                <button
                  onClick={onPrevPageClick}
                  className="font-medium text-2xl focus:outline-none">
                  &larr;
                </button>
              ) : <div></div>}
              <span>
                {page} of {data?.restaurants.totalPages}
              </span>
              {page !== data?.restaurants.totalPages ? (
                <button
                  onClick={onNextPageClick}
                  className="font-medium text-2xl focus:outline-none">
                  &rarr;
                </button>
              ) : <div></div>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Restaurants;
