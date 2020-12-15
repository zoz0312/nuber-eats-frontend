import React from 'react';
import { createMockClient, MockApolloClient } from 'mock-apollo-client';
import { render, wait, RenderResult, waitFor } from '../../../test-utils';
import { ApolloProvider } from '@apollo/client';
import ClientSearch, { SEARCH_RESTAURANT } from '../Search';
import { searchRestaurant } from '../../../__generated__/searchRestaurant';
import { ME_QUERY } from '../../../hooks/useMe';

jest.mock('../../../components/Restaurant', () => {
  return () => <span>Restaurant</span>
});

jest.mock('../../../hooks/useScrollPage', () => {
  return (num: number) => ({
    page: 0,
    setTotalPages: jest.fn()
  });
});

const mockPush = jest.fn();
const localSearch = '/search?term=bbq';
jest.mock('react-router-dom', () => {
  const realModule = jest.requireActual('react-router-dom');
  return {
    ...realModule,
    useLocation: () => ({
      search: localSearch,
    }),
    useHistory: () => ({
      push: mockPush,
    })
  }
});

describe('<ClientSearch />', () => {
  let mockedClient: MockApolloClient;
  let renderResult: RenderResult;

  let queryLoading = false;
  const returnData: searchRestaurant = {
    searchRestaurant: {
      __typename: "SearchRestaurantOutput",
      ok: true,
      error: null,
      totalPages: 2,
      totalResults: 12,
      restaurants: [{
        __typename: "Restaurant",
        id: 1,
        name: '',
        coverImage: '',
        category: null,
        address: '',
        isPromoted: false,
      }],
    }
  };

  it('render OK', async () => {
    await waitFor(() => {
      mockedClient = createMockClient();
      mockedClient.setRequestHandler(
        SEARCH_RESTAURANT,
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
          <ClientSearch />
        </ApolloProvider>
      );
    });
    await wait();
    await waitFor(() =>
      expect(document.title).toBe(`Search | Nuber Eats`));
  });

  // it('render loading', async () => {
  //   returnData.searchRestaurant.totalPages = 2;
  //   await waitFor(() => {
  //     mockedClient = createMockClient();
  //     mockedClient.setRequestHandler(
  //       SEARCH_RESTAURANT,
  //       () => {
  //         return Promise.resolve({
  //           data: {
  //             ...returnData
  //           },
  //           loading: queryLoading,
  //         });
  //       }
  //     );
  //     renderResult = render(
  //       <ApolloProvider client={mockedClient}>
  //         <ClientSearch />
  //       </ApolloProvider>
  //     );
  //   });
  //   await wait();
  // });

  afterAll(() => {
    jest.clearAllMocks();
  });
});