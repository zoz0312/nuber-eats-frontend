import React from 'react';
import { createMockClient, MockApolloClient } from 'mock-apollo-client';
import { render, wait, RenderResult, waitFor  } from '../../../test-utils';
import ClientRestaurants, { RESTAURANTS_QUERY } from '../Restaurants';
import { restaurantsPageQuery } from '../../../__generated__/restaurantsPageQuery';
import { ApolloProvider } from '@apollo/client';
import userEvent from '@testing-library/user-event';
import { fireEvent } from '@testing-library/react';

const mockPush = jest.fn();
jest.mock('react-router-dom', () => {
  const realModule = jest.requireActual('react-router-dom');
  return {
    ...realModule,
    useHistory: () => ({
      push: mockPush,
    })
  }
});

jest.mock('../../../components/Restaurant', () => {
  return () => <span>Restaurant</span>
});

describe('<ClientRestaurants />', () => {
  let mockedClient: MockApolloClient;
  let renderResult: RenderResult;

  const returnData: restaurantsPageQuery = {
    allcategories:{
      __typename: "AllCategoriesOutput",
      ok: true,
      error: null,
      categories: [{
        __typename: "Category",
        id: 1,
        name: 'bbq category',
        coverImage: null,
        slug: 'bbq-category',
        restaurantCount: 2,
      }],
    },
    restaurants: {
      __typename: "RestaurantsOutput",
      ok: true,
      error: null,
      totalPages: 10,
      totalResults: null,
      results: [{
        __typename: "Restaurant",
        id: 1,
        name: 'restaurant bbq',
        coverImage: '',
        category: null,
        address: '',
        isPromoted: true,
      }],
    },
  };

  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient();
      mockedClient.setRequestHandler(
        RESTAURANTS_QUERY,
        () => {
          return Promise.resolve({
            data: {
              ...returnData
            },
          });
        }
      );
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <ClientRestaurants />
        </ApolloProvider>
      );
    });
  });

  it('render OK', async () => {
    await wait();
    await waitFor(() =>
      expect(document.title).toBe(`Home | Nuber Eats`));
  });

  it('search form', async () => {
    await wait();
    const formData = {
      searchTerm: 'testing',
    };
    const { debug, getByPlaceholderText } = renderResult;
    const serchTerm = getByPlaceholderText(/search restaurats.../i);
    await waitFor(() => {
      userEvent.type(serchTerm, formData.searchTerm);
      fireEvent.submit(serchTerm)
      // userEvent.click(form)
    });
    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/search',
      search: `?term=testing`,
    });
    debug();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
})