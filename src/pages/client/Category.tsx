import { gql, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CATEGORY_FRAGMENT, RESTUARANT_FRAGMENT } from '../../fragments';
import { category, categoryVariables, category_category_category_restaurants } from '../../__generated__/category';
import { Helmet } from 'react-helmet';
import Restaurant from '../../components/Restaurant';
import useScrollPage from '../../hooks/useScrollPage';
import Article from '../../components/Article';

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
  // const [page, setPage] = useState(1);
  const { page, setTotalPages } = useScrollPage(1);
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
    },
    fetchPolicy: "network-only"
  });

  useEffect(() => {
    if (data && data.category.category) {
      const { category: { category, totalPages } } = data;
      setTotalPages(totalPages);
      if (category.restaurants) {
        setItemList([
          ...itemList,
          ...category.restaurants,
        ]);
      }
    }
  }, [data]);

  return (
    <section className="max-w-screen">
      <Helmet>
        {`${data?.category.category?.name} | Nuber Eats`}
      </Helmet>
      <header
        className="bg-gray-800 py-40 w-full items-center"
      >
        <div
          className="bg-white w-2/6 p-5 md:pl-24 bg-cover bg-cetner"
          style={{backgroundImage: `url(${data?.category.category?.coverImage})`}}
        >
          <h4 className="text-3xl font-border">{ data?.category.category?.name }</h4>
        </div>
      </header>
      <Article loading={loading}>
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
      </Article>
    </section>
  );
}

export default ClientCategory;
