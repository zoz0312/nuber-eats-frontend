import React from 'react';
import { createMockClient, MockApolloClient } from 'mock-apollo-client';
import { render, wait, RenderResult, waitFor } from '../../../test-utils';
import { ApolloProvider } from '@apollo/client';
import { verifyEmail } from '../../../__generated__/verifyEmail';
import { ME_QUERY } from '../../../hooks/useMe';
import ConfirmEmail, { VERIFY_EMAIL_MUTATION } from '../ConfirmEmail';

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

describe('<ConfirmEmail />', () => {
  let mockedClient: MockApolloClient;
  let renderResult: RenderResult;

  const returnData: verifyEmail = {
    verifyEmail: {
      __typename: "VerifyEmailOutput",
      ok: false,
      error: null,
    }
  };

  const returnMeData = {
    me: {
      id: 1,
      email: '',
      role: '',
      verified: false,
    },
  }

  beforeEach(() => {
    mockedClient = createMockClient();
    mockedClient.setRequestHandler(
      ME_QUERY,
      () => {
        return Promise.resolve({
          data: {
            ...returnMeData
          },
        });
      }
    );
  });

  it('render verify false', async () => {
    await waitFor(() => {
      mockedClient.setRequestHandler(
        VERIFY_EMAIL_MUTATION,
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
          <ConfirmEmail />
        </ApolloProvider>
      );
    });
    await wait();
    const { getByText } = renderResult;
    getByText(/Confirming Email.../i);
  });

  it('render verify true', async () => {
    returnData.verifyEmail.ok = true;
    await waitFor(() => {
      mockedClient.setRequestHandler(
        VERIFY_EMAIL_MUTATION,
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
          <ConfirmEmail />
        </ApolloProvider>
      );
    });
    await wait();
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});