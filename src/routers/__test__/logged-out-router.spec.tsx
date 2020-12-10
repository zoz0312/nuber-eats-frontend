import React from 'react';
import { render, RenderResult, waitFor } from '@testing-library/react';
import LoggedOutRouter from '../logged-out-router';

jest.mock('../../pages/Login', () => {
  return () => <span>Login</span>
});

jest.mock('../../pages/CreateAccount', () => {
  return () => <span>Create Account</span>
});

jest.mock('../../pages/404', () => {
  return () => <span>NotFound</span>
});

describe('<LoggedOutRouter />', () => {
  it('render loggedOutRouter', async () => {
    let renderResult: RenderResult;

    await waitFor(() => {
      renderResult = render(
        <LoggedOutRouter />
      );
    });
  });
})