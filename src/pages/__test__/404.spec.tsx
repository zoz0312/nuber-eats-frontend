import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { NotFound } from '../404';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router } from 'react-router-dom';

describe('<NotFound />', () => {
  it('render OK', async () => {
    const { getByText } = render(
      <HelmetProvider>
        <Router>
          <NotFound />
        </Router>
      </HelmetProvider>
    );
    await waitFor(() => {
      expect(document.title).toBe('Not Found | Number Eats');
    });
    getByText('Page Not Found');
  });
})