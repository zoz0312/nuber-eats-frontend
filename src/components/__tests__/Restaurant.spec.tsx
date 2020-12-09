import React from 'react';
import Restaurant from '../Restaurant';
import { render } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom';

describe('<Restaurant />', () => {
  it('render OK with Props', () => {
    const restaurantProps = {
      id: 1,
      coverImage: 'test',
      name: 'name',
      categoryName: 'category'
    };

    const { debug, getByText, container } = render(
      <Router>
        <Restaurant
          {...restaurantProps}
        />
      </Router>
    );
    getByText(restaurantProps.name);
    getByText(restaurantProps.categoryName);
    expect(container.firstChild).toHaveAttribute('href', `/restaurant/${restaurantProps.id}`)
  })
})