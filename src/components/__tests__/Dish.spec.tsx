import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter as Router } from 'react-router-dom';
import React from 'react';
import { render } from '@testing-library/react';
import Dish from '../Dish';

describe('<Dish />', () => {
  it('render with Props', () => {
    const dishProps = {
      id: 1,
      name: 'test',
      price: 10,
      photo: 'test',
      description: 'test',
      options: [
        { __typename: "DishOption", name: 'testOption', extran: null, choices: null, },
        { __typename: "DishOption", name: 'testOption2', extran: null, choices: null, },
        { __typename: "DishOption", name: 'testOption3', extran: null, choices: null, },
      ]
    };

    const { getByText } = render(<Dish menu={dishProps} />);
    getByText('testOption');
    getByText(', testOption2');
    getByText(', testOption3');

  })
})