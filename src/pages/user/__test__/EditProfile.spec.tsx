import React from 'react';
import { createMockClient, MockApolloClient } from 'mock-apollo-client';
import { render, wait, RenderResult, waitFor } from '../../../test-utils';
import { ApolloProvider } from '@apollo/client';
import { ME_QUERY } from '../../../hooks/useMe';
import EditProfile, { EDIT_PROFILE_MUTATION } from '../EditProfile';
import userEvent from '@testing-library/user-event';
import { UserRole } from '../../../__generated__/globalTypes';

describe('<EditProfile />', () => {
  let mockedClient: MockApolloClient;
  let renderResult: RenderResult;

  const returnMeData = {
    me: {
      id: 1,
      email: 'test@gmail.com',
      role: UserRole.Client,
      verified: false,
    },
  };

  beforeEach(async () => {
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
    await waitFor(() => {
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <EditProfile />
        </ApolloProvider>
      );
    });
    await wait();
  });

  it('render OK', async () => {
    await waitFor(() =>
      expect(document.title).toBe(`Edit Profile | Nuber Eats`));
  });

  it('Edit true', async () => {
    const formData = {
      email: 'real@email.com',
      password: '123123',
    };
    const { getByRole, getByPlaceholderText } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const password = getByPlaceholderText(/password/i);
    const button = getByRole('button');
    const mockedLoginMutationResponse = jest.fn().mockResolvedValue({
      data: {
        editProfile: {
          ok: true,
          error: 'mutation error',
        }
      }
    });
    mockedClient.setRequestHandler(
      EDIT_PROFILE_MUTATION,
      mockedLoginMutationResponse
    );
    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(button);
    });
    expect(mockedLoginMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedLoginMutationResponse).toHaveBeenCalledWith({
      input: {
        email: formData.email,
        password: formData.password,
      }
    });
  });
});