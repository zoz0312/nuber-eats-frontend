import { gql, useQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { CATEGORY_FRAGMENT, RESTUARANT_FRAGMENT } from '../../fragments';
import { category, categoryVariables } from '../../__generated__/category';

const CATEGORY_QUERY = gql`
  query category($input: CategoryInput!) {
    category(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
      category {
        ...CategoryParts
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
  const params = useParams<ICategoryParams>();
  const { data, loading } = useQuery<
    category,
    categoryVariables
  >(CATEGORY_QUERY, {
    variables: {
      input: {
        page: 1,
        slug: params.slug,
      }
    }
  });

  console.log('slug', data)

  return (
    <div>카테고뤼</div>
  );
}

export default ClientCategory;
