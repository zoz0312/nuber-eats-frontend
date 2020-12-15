import React from 'react';
import { ApolloProvider } from '@apollo/client';
import CreateAccount, { CREATE_ACCOUNT_MUTATION } from '../CreateAccount';
import { createMockClient, MockApolloClient } from 'mock-apollo-client';
import { render, waitFor } from '../../test-utils';
import { getByText, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserRole } from '../../__generated__/globalTypes';

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
    await waitFor(() =>
      expect(document.title).toBe('Create Account | Number Eats'));
  });

  it('renders validation error', async () => {
    const { getByRole, getByPlaceholderText, getByText } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const button = getByText(/create account/i);
    await waitFor(() => {
      userEvent.type(email, 'worng@email');
    });
    let errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent(/please enter a valid email/i);
    await waitFor(() => { userEvent.clear(email) });
    errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent(/email is required/i);
    await waitFor(() => {
      userEvent.type(email, 'real@email.com');
      userEvent.click(button);
    });
    errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent(/password is required/i);
  });

  it('submit mutation with form values', async () => {
    const formData = {
      email: 'real@email.com',
      password: '123123',
      role: UserRole.Client,
    }
    const { getByRole, getByPlaceholderText, getByText } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const password = getByPlaceholderText(/password/i);
    const button = getByText(/create account/i);
    const mockedLoginMutationResponse = jest.fn().mockResolvedValue({
      data: {
        createAccount: {
          ok: true,
          error: 'mutation error',
        }
      }
    });
    mockedClient.setRequestHandler(
      CREATE_ACCOUNT_MUTATION,
      mockedLoginMutationResponse
    );
    jest.spyOn(window, 'alert').mockImplementation(() => null);
    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(button);
    });
    expect(mockedLoginMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedLoginMutationResponse).toHaveBeenCalledWith({
      createAccountInput: {
        email: formData.email,
        password: formData.password,
        role: formData.role,
      }
    });
    expect(window.alert).toHaveBeenCalledWith('아이디가 생성되었습니다!\n로그인 해주세요!');
    const mutationError = getByRole('alert');
    expect(mockPush).toHaveBeenCalledWith('/');
    expect(mutationError).toHaveTextContent('mutation error');
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
