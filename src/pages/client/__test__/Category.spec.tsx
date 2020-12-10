import React from 'react';
import { createMockClient, MockApolloClient } from 'mock-apollo-client';
import { render, wait, RenderResult, waitFor } from '../../../test-utils';
import { ApolloProvider } from '@apollo/client';
import ClientCategory, { CATEGORY_QUERY } from '../Category';
import { category } from '../../../__generated__/category';

jest.mock('../../../components/Restaurant', () => {
  return () => <span>Restaurant</span>
});

let mockedObject = {
  x: 2,
  y: 2,
  screenY: 2,
};

jest.mock('../../../hooks/useScrollPage', () => {
  return () => (mockedObject);
});

describe('<Category />', () => {
  let mockedClient: MockApolloClient;
  let renderResult: RenderResult;

  let queryLoading = false;
  const returnData: category = {
    category: {
      __typename: "CategoryOutput",
      ok: false,
      error: null,
      totalPages: 1,
      totalResults: null,
      category: {
        __typename: 'Category',
        id: 1,
        name: 'header',
        coverImage: null,
        slug: '',
        restaurantCount: 1,
        restaurants: [{
          __typename: 'Restaurant',
          id: 0,
          name: 'bbq',
          coverImage: '',
          category: null,
          address: '',
          isPromoted: false,
        }]
      }
    }
  };

  it('render OK', async () => {
    await waitFor(() => {
      mockedClient = createMockClient();
      mockedClient.setRequestHandler(
        CATEGORY_QUERY,
        () => {
          return Promise.resolve({
            data: {
              ...returnData
            },
            loading: queryLoading,
          });
        }
      );
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <ClientCategory />
        </ApolloProvider>
      );
    });
    await wait();
    await waitFor(() =>
      expect(document.title).toBe(`header | Nuber Eats`));
  });

  it('render loading', async () => {
    returnData.category.totalPages = 2;
    await waitFor(() => {
      mockedClient = createMockClient();
      mockedClient.setRequestHandler(
        CATEGORY_QUERY,
        () => {
          return Promise.resolve({
            data: {
              ...returnData
            },
            loading: queryLoading,
          });
        }
      );
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <ClientCategory />
        </ApolloProvider>
      );
    });
    await wait();
    const { getByText } = renderResult;
    getByText(/loading.../i);
  });
})