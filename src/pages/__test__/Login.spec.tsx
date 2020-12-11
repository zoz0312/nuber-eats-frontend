import React from 'react';
import { render, RenderResult, waitFor } from '../../test-utils';
import Login, { LOGIN_MUTATION } from '../Login';
import { ApolloProvider } from '@apollo/client';
import { createMockClient, MockApolloClient } from 'mock-apollo-client';
import userEvent from '@testing-library/user-event';
import { LOCALSTORAGE_TOKEN } from '../../constants';

describe('<Login />', () => {
  let renderResult: RenderResult;
  let mockedClient: MockApolloClient;
  const formData = {
    email: 'real@test.com',
    password: '123123123',
  };

  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient();
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <Login />
        </ApolloProvider>
      );
    });
  })

  it('render Login Page', async() => {
    await waitFor(() => {
      expect(document.title).toBe('Login | Nuber Eats');
    });
  });

  it('display email validation erorr', async () => {
    const { getByPlaceholderText, debug, getByText, getByRole } = renderResult;
    const email = getByPlaceholderText(/Email/i);
    await waitFor(() => {
      userEvent.type(email, 'this@wont');
    });
    let errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent(/Please enter a valid email/i);
    // getByText(/Please enter a valid email/i);
    await waitFor(() => {
      userEvent.clear(email);
    });
    errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent(/Email is required/i);
    // getByText(/Email is required/i);
  });

  it('display password required erorr', async () => {
    const { getByPlaceholderText, debug, getByText, getByRole } = renderResult;
    const email = getByPlaceholderText(/Email/i);
    const submitButton = getByRole('button');
    await waitFor(() => {
      userEvent.type(email, 'test@gmail.com');
      userEvent.click(submitButton);
    });
    const errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent(/password is required/i);
  });

  it('submit form & calls mutation Success', async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const password = getByPlaceholderText(/password/i);
    const submitButton = getByRole('button');

    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        login: {
          ok: true,
          error: null,
          token: 'xxx',
        }
      }
    });

    mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);

    jest.spyOn(Storage.prototype, 'setItem');

    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(submitButton);
    });
    expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedMutationResponse).toHaveBeenCalledWith({
      email: formData.email,
      password: formData.password,
    });
    expect(localStorage.setItem).toHaveBeenCalledWith(LOCALSTORAGE_TOKEN, 'xxx');
  });

  it('submit form & calls mutation Print Error', async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const password = getByPlaceholderText(/password/i);
    const submitButton = getByRole('button');

    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        login: {
          ok: false,
          error: 'mutaion error',
          token: null,
        }
      }
    });

    mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);

    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(submitButton);
    });
    expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedMutationResponse).toHaveBeenCalledWith({
      email: formData.email,
      password: formData.password,
    });

    const errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent(/mutaion error/i);
  });

});


