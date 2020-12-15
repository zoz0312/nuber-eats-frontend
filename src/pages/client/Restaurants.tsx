import { gql, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { restaurantsPageQuery, restaurantsPageQueryVariables } from '../../__generated__/restaurantsPageQuery';
import Restaurant from '../../components/Restaurant';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { CATEGORY_FRAGMENT, RESTUARANT_FRAGMENT } from '../../fragments';

export const RESTAURANTS_QUERY = gql`
  query restaurantsPageQuery($input: RestaurantsInput!) {
    allcategories {
      ok
      error
      categories {
        ...CategoryParts
      }
    }
    restaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      results {
        ...RestaurantParts
      }
    }
  }
  ${RESTUARANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

interface IFormProps {
  searchTerm: string;
}

const ClientRestaurants: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, loading } = useQuery<
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
  const { register, handleSubmit, getValues } = useForm<IFormProps>();
  const history = useHistory();
  const onSearchSubmit = () => {
    const { searchTerm } = getValues();
    history.push({
      pathname: '/search',
      search: `?term=${searchTerm}`,
    })
  }

  return (
    <section>
      <Helmet>
        <title>Home | Nuber Eats</title>
      </Helmet>
      <form
        onSubmit={handleSubmit(onSearchSubmit)}
        className="bg-gray-800 w-full py-40 flex items-center justify-center">
        <input
          ref={register({ required: true, min: 3 })}
          type="Search"
          name="searchTerm"
          className="input w-3/4 md:w-3/12 rounded-md border-0"
          placeholder="Search restaurats..." />
      </form>
      <div>
        {!loading && (
          <div className="max-w-screen-2xl mx-auto mt-8 pb-20">
            <div className="flex justify-around max-w-sm mx-auto">
            {data?.allcategories.categories?.map((category, index) => (
              <Link key={index} to={`/category/${category.slug}`}>
                <div
                  className="w-16 flex flex-col items-center group">
                  <div
                    style={{backgroundImage: `url(${category.coverImage})`}}
                    className="w-16 h-16 rounded-full bg-cover group-hover:bg-gray-100 cursor-pointer">
                  </div>
                  <span className="mt-1 text-sm text-center font-bold break-all">{ category.name }</span>
                </div>
              </Link>
            ))}
            </div>
            <div className="grid md:grid-cols-3 gap-x-5 gap-y-10 mt-10">
              {data?.restaurants.results?.map((restaurant, index) => (
                <Restaurant
                  key={index}
                  id={restaurant.id}
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
    </section>
  )
}

export default ClientRestaurants;
