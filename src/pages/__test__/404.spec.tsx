import React from 'react';
import { render, waitFor } from '../../test-utils';
import { NotFound } from '../404';

describe('<NotFound />', () => {
  it('render OK', async () => {
    const { getByText } = render(
      <NotFound />
    );
    await waitFor(() => {
      expect(document.title).toBe('Not Found | Number Eats');
    });
    getByText('Page Not Found');
  });
})