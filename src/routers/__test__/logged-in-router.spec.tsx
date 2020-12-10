import React from 'react';
import { render, RenderResult, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router } from 'react-router-dom';
import LoggedInRouter from '../logged-in-router';
import { MockApolloClient, createMockClient } from 'mock-apollo-client';
import { ME_QUERY } from '../../hooks/useMe';
import { UserRole } from '../../__generated__/globalTypes';
import { ApolloProvider } from '@apollo/client';

jest.mock('../../pages/user/ConfirmEmail', () => {
  return () => <span>Confirm Email</span>
});
jest.mock('../../pages/user/EditProfile', () => {
  return () => <span>Edit Profile</span>
});
jest.mock('../../pages/client/Search', () => {
  return () => <span>Search</span>
});
jest.mock('../../pages/client/Category', () => {
  return () => <span>Category</span>
});
jest.mock('../../pages/client/Restaurants', () => {
  return () => <span>Restaurants</span>
});
jest.mock('../../pages/client/Restaurant', () => {
  return () => <span>Restaurant</span>
});
jest.mock('../../pages/404', () => {
  return () => <span>NotFound</span>
});

describe('<LoggedInRouter />', () => {
  const userInfo = {
    id: 1,
    email: 'test@gmail.com',
    role: UserRole.Client,
    verified: true,
  }

  it('render loggedInRouter is Loading', async () => {
    let renderResult: RenderResult;
    let mockedClient: MockApolloClient;

    await waitFor(() => {
      mockedClient = createMockClient();
      mockedClient.setRequestHandler(
        ME_QUERY,
        () => {
          return Promise.resolve({
            data: {
              me: {},
              loading: true,
            }
          });
        }
      );
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <Router>
            <HelmetProvider>
              <LoggedInRouter />
            </HelmetProvider>
          </Router>
        </ApolloProvider>
      );
    });

    const { getByText } = renderResult;
    getByText(/loading/i);
  });

  it('render loggedInRouter get data', async () => {
    let renderResult: RenderResult;
    let mockedClient: MockApolloClient;
    await waitFor(() => {
      mockedClient = createMockClient();
      mockedClient.setRequestHandler(
        ME_QUERY,
        () => {
          return Promise.resolve({
            data: {
              me: {
                ...userInfo
              },
            }
          });
        }
      );
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <Router>
            <HelmetProvider>
              <LoggedInRouter />
            </HelmetProvider>
          </Router>
        </ApolloProvider>
      );
    });
  });
})