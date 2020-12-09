import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter as Router } from 'react-router-dom';
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { Header } from '../Header';
import { ME_QUERY } from '../../hooks/useMe';

describe('<Header />', () => {
  it('render verify banner', async () => {
    await waitFor(async () => {
      const { getByText } = render(
        <MockedProvider mocks={[
          {
            request: {
              query: ME_QUERY,
            },
            result: {
              data: {
                me: {
                  id: 1,
                  email: '',
                  role: '',
                  verified: false,
                },
              },
            },
          },
        ]}>
          <Router>
            <Header />
          </Router>
        </MockedProvider>
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
      getByText('Please verify your email!');
    });
  });

  it('render without verify banner', async () => {
    await waitFor(async () => {
      const { queryByText } = render(
        <MockedProvider mocks={[
          {
            request: {
              query: ME_QUERY,
            },
            result: {
              data: {
                me: {
                  id: 1,
                  email: '',
                  role: '',
                  verified: true,
                },
              },
            },
          },
        ]}>
          <Router>
            <Header />
          </Router>
        </MockedProvider>
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(queryByText('Please verify your email!')).toBeNull();
    });
  });
})