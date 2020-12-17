import React from 'react';
import { render, wait, waitFor } from '../../test-utils';
import Article from '../Article';
import DishForm from '../DishForm';
import { findDish_findDish_dish } from './../../__generated__/findDish';
import userEvent from '@testing-library/user-event';
import { RenderResult } from '@testing-library/react';
import { act } from "react-dom/test-utils";


jest.mock('../Button', () => {
  return () => <span>buttonText</span>
});

describe('<DishForm />', () => {
  it('DishForm Render', async () => {
    const { getByText } = render(
      <DishForm
        onSubmit={() => {}}
        buttonText={`buttonText`}
        loading={false}
      />
    );
    getByText('옵션 추가하기');
  });

  it('DishForm Render with Default Value', async () => {
    let renderResult: any;

    const defaultValues: findDish_findDish_dish = {
      __typename: "Dish",
      id: 1,
      name: 'Dish Name',
      price: 10,
      description: 'Dish Description',
      photo: null,
      options: [
        {
          __typename: "DishOption",
          name: 'option1',
          extra: 20,
          choices: [
            { __typename: "DishChice", name: 'choice', extra: 30 }
          ]
        }
      ]
    };

    renderResult = render(
      <DishForm
        onSubmit={() => {}}
        buttonText={`buttonText`}
        defaultValues={defaultValues}
        loading={false}
      />
    );

    const { getByText, rerender, container, getByPlaceholderText } = renderResult;
    const name = getByPlaceholderText(/^name$/i);
    const price = getByPlaceholderText(/^price$/i);
    const description = getByPlaceholderText(/description/i);
    const optionName = getByPlaceholderText(/option name/i);
    const optionExtra = getByPlaceholderText(/option extra/i);
    // const choiceName = getByPlaceholderText(/choice name/i);
    // const choiceExtra = getByPlaceholderText(/choice extra/i);
    const button = getByText(/buttonText/i);

    await waitFor(() => {
      userEvent.type(name, defaultValues.name);
      userEvent.type(price, defaultValues.price.toString());
      userEvent.type(description, defaultValues.description);
      if (defaultValues.options) {
        userEvent.type(optionName, defaultValues.options[0].name);
        if (defaultValues.options[0].extra) {
          userEvent.type(optionExtra, defaultValues.options[0].extra.toString());
        }
      }
      userEvent.click(button);
    })

    rerender(
      <Article
        loading={true}
        className={``}
      />
    );
    getByText('Loading...');
  });
});