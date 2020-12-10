import { gql, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { CATEGORY_FRAGMENT, RESTUARANT_FRAGMENT } from '../../fragments';
import { category, categoryVariables, category_category_category_restaurants } from '../../__generated__/category';
import { Helmet } from 'react-helmet';
import Restaurant from '../../components/Restaurant';
import useScrollPage from '../../hooks/useScrollPage';

export const CATEGORY_QUERY = gql`
  query category($input: CategoryInput!) {
    category(input: $input) {
      ok
      error
      totalPages
      totalResults
      category {
        ...CategoryParts
        restaurants {
          ...RestaurantParts
        }
      }
    }
  }
  ${RESTUARANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

interface ICategoryParams {
  slug: string;
};

const ClientCategory: React.FC = () => {
  const [page, setPage] = useState(1);
  const scrollState = useScrollPage();
  const [itemList, setItemList] = useState<category_category_category_restaurants[]>([]);
  const params = useParams<ICategoryParams>();
  const { data, loading } = useQuery<
    category,
    categoryVariables
  >(CATEGORY_QUERY, {
    variables: {
      input: {
        page,
        slug: params.slug,
      }
    }
  });

  useEffect(() => {
    if (data && data.category.category) {
      const { category: { category } } = data;
      if (category.restaurants) {
        setItemList([
          ...itemList,
          ...category.restaurants,
        ]);
      }
    }
  }, [data]);

  useEffect(() => {
    if (!data || !data.category.totalPages) {
      return;
    }
    const { y, screenY } = scrollState;
    if (y === screenY) {
      if (!loading && page < data.category.totalPages) {
        setPage(current => current + 1)
      }
    }
  }, [scrollState]);

  return (
    <section className="max-w-screen">
      <Helmet>
        <title>{`${data?.category.category?.name} | Nuber Eats`}</title>
      </Helmet>
      <header
        className="bg-gray-800 py-40 w-full items-center"
      >
        <div
          className="bg-white w-2/6 p-5 md:pl-24 bg-cover bg-cetner"
          style={{backgroundImage: `url(${data?.category.category?.coverImage})`}}
        >
          <h4 className="text-3xl">{ data?.category.category?.name }</h4>
        </div>
      </header>
      <article className="common-article">
        <h3 className="text-2xl font-medium">{`${data?.category.totalResults} Restaurants`}</h3>
        <div className="grid md:grid-cols-3 gap-x-5 gap-y-10 pb-10 mt-10 mb-10">
          {itemList.map((restaurant, index) => (
            <Restaurant
              key={index}
              id={restaurant.id}
              coverImage={restaurant.coverImage}
              name={restaurant.name}
              categoryName={restaurant.category?.name}
            />
          ))}
        </div>
        {page < (data?.category.totalPages || 0) && (
          <div className="text-3xl text-center mb-10">Loading...</div>
        )}
      </article>
    </section>
  );
}

export default ClientCategory;
