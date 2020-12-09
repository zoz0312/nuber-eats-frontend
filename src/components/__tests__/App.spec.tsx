import React from 'react';
import { render, waitFor } from '@testing-library/react';
import App from '../App';
import { isLoggedInVar } from '../../apollo';

jest.mock('../../routers/logged-out-router', () => {
  return () => <span>logged-out</span>
});
jest.mock('../../routers/logged-in-router', () => {
  return () => <span>logged-in</span>
});

describe("<App />", () => {
  it('renders Logged Out', () => {
    const { debug, getByText } = render(<App />);
    getByText('logged-out');
  });

  it('renders Logged In', async () => {
    const { debug, getByText } = render(<App />);
    await waitFor(() => {
      isLoggedInVar(true);
    });
    getByText('logged-in');
  });
})