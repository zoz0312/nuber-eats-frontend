import React from 'react';
import { createMockClient, MockApolloClient } from 'mock-apollo-client';
import { render, wait, RenderResult, waitFor  } from '../../../test-utils';
import ClientRestaurant, { RESTAURANT_QUERY } from '../Restaurant';
import { restaurant } from '../../../__generated__/restaurant';
import { ApolloProvider } from '@apollo/client';

jest.mock('../../../components/Dish', () => {
  return () => <span>Dish</span>
});

describe('<ClientRestaurant />', () => {
  let mockedClient: MockApolloClient;
  let renderResult: RenderResult;

  const returnData: restaurant = {
    restaurant: {
      __typename: "RestaurantOutput",
      ok: true,
      error: null,
      restaurant: {
        __typename: "Restaurant",
        id: 1,
        name: 'test',
        coverImage: '',
        category: null,
        address: '',
        isPromoted: false,
        menu: [{
          __typename: "Dish",
          id: 1,
          name: 'dish',
          price: 1,
          photo: 'photo',
          description: 'dish',
          options: [{
            __typename: "DishOption",
            name: ''
          }]
        }]
      }
    }
  };

  it('render OK', async () => {
    await waitFor(() => {
      mockedClient = createMockClient();
      mockedClient.setRequestHandler(
        RESTAURANT_QUERY,
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
          <ClientRestaurant />
        </ApolloProvider>
      );
    });
    await wait();
    await waitFor(() =>
      expect(document.title).toBe(`test | Nuber Eats`));
  });

  it('menu is null', async () => {
    returnData.restaurant.restaurant?.menu.shift();
    await waitFor(() => {
      mockedClient = createMockClient();
      mockedClient.setRequestHandler(
        RESTAURANT_QUERY,
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
          <ClientRestaurant />
        </ApolloProvider>
      );
    });
    await wait();
    const { getByText } = renderResult;
    getByText(/메뉴가 없습니다./i);
  });
});