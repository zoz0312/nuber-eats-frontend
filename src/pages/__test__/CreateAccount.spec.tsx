import React from 'react';
import { ApolloProvider } from '@apollo/client';
import CreateAccount from '../CreateAccount';
import { createMockClient, MockApolloClient } from 'mock-apollo-client';
import { render, waitFor } from '../../test-utils';
import { RenderResult } from '@testing-library/react';

describe('<CreateAccount />', () => {
  let mockedClient: MockApolloClient;
  let renderResult: RenderResult;

  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient();
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <CreateAccount />
        </ApolloProvider>
      );
    });
  });

  it('renders OK', async () => {
    await waitFor(() => expect(document.title).toBe('Create Account | Number Eats'));

  })
})