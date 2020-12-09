import React from 'react';
import FormError from '../FormError';
import { render } from '@testing-library/react';

describe('<FormError />', () => {
  it('render OK with Props', () => {
    const { getByText } = render(<FormError errorMessage="test" />);
    getByText('test');
  })
})