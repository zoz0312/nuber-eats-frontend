import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import { createDish, createDishVariables } from './../../__generated__/createDish';
import Article from '../../components/Article';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import Button from './../../components/Button';
import { MY_RESTAURANT_QUERY } from './MyRestaurant';

const CREATE_DISH_MUTATION = gql`
  mutation createDish($input: CreateDishInput!) {
    createDish(input: $input) {
      ok
      error
    }
  }
`;

interface IParams {
  id: string;
};

interface IDishForm {
  name: string;
  price: string;
  description: string;
  [key: string]: string;
}

const AddDish: React.FC = () => {
  const { id } = useParams<IParams>();
  const [options, setOptions] = useState<number[]>([]);
  const [choices, setChoices] = useState<{optionId: number, id: number}[]>([]);

  const onCompleted = (data: createDish) => {
    const { createDish: { ok } } = data;
    if (ok) {
      // TODO: something
    }
  };

  const [createDishMutation, { loading }] = useMutation<
    createDish,
    createDishVariables
  >(CREATE_DISH_MUTATION, {
    onCompleted,
    refetchQueries: [{
      query: MY_RESTAURANT_QUERY,
      variables: {
        input: {
          id: +id,
        }
      }
    }]
  });

  const {
    register,
    getValues,
    formState,
    handleSubmit,
    setValue,
  } = useForm<IDishForm>({
    mode: 'onChange',
  });

  const onSubmit = () => {
    if (loading) { return; }
    const { name, price, description, ...dishOption } = getValues();
    const dishOptions = options.map(theId => {
      const optionChoice =
        choices
          .filter(choice => choice.optionId === theId)
          .map(choice => ({
            name: dishOption[`choiceName-${theId}-${choice.id}`],
            extra: +dishOption[`choiceExtra-${theId}-${choice.id}`],
          }));
      return {
        name: dishOption[`optionName-${theId}`],
        extra: +dishOption[`optionExtra-${theId}`],
        choices: optionChoice,
      }
    });

    createDishMutation({
      variables: {
        input: {
          name,
          price: +price,
          description,
          restaurantId: +id,
          options: dishOptions,
        }
      }
    });
    // history.goBack();
  }

  const onAddOptionClick = () => {
    setOptions(current => [...current, Date.now()]);
  };

  const onAddChoiceClick = (optionId: number) => {
    setChoices(current => [...current, { optionId, id: Date.now() } ]);
  }

  const onDeleteOptionClick = (idToDelete: number) => {
    setOptions(current => current.filter(id => id !== idToDelete));

    setValue(`optionName-${idToDelete}`, '');
    setValue(`optionExtra-${idToDelete}`, '0');
  }

  const onDeleteChoiceClick = (optionId: number, choiceId: number) => {
    setChoices(current => current.filter(choice => {
      return choice.id !== choiceId
    }));

    setValue(`choiceName-${optionId}-${choiceId}`, '');
    setValue(`choiceExtra-${optionId}-${choiceId}`, '0');
  }

  return (
    <div>
      <Helmet>
        {`Create Dish | Nuber Eats`}
      </Helmet>
      <Article loading={loading}>
        <h4 className="w-full font-semibold text-center pl-5 text-2xl mb-6">Add Dish</h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-5 my-5 px-5 w-full max-w-screen-sm mx-auto"
        >
          <input
            ref={register({required: 'name is required.'})}
            className="input"
            name="name"
            minLength={2}
            placeholder="Name"
            type="text"
            required
          />
          <input
            ref={register({required: 'price is required.'})}
            className="input"
            name="price"
            min={0}
            placeholder="Price"
            type="number"
            required
          />
          <input
            ref={register({required: 'description is required.'})}
            className="input"
            name="description"
            minLength={2}
            placeholder="Description"
            type="text"
            required
          />
          <div
            className="flex flex-col items-start"
          >
            {options.length !== 0 &&
              options.map((id) => (
              <div key={id}>
                <div
                  className="mt-5 flex flex-row justify-center items-center"
                >
                  <input
                    ref={register({required: true})}
                    name={`optionName-${id}`}
                    type="text"
                    placeholder="Option Name"
                    className="mr-2 input-sm"
                  />
                  <input
                    ref={register({required: true})}
                    name={`optionExtra-${id}`}
                    type="number"
                    min={0}
                    placeholder="Option Extra"
                    defaultValue={0}
                    className="mr-2 input-sm"
                  />
                  <div className="inline-block">
                    <button
                      type="button"
                      name="add-dish-btn"
                      onClick={() => onAddChoiceClick(id)}
                      className="cursor-pointer text-white bg-lime-600 py-1 px-2 hover:bg-lime-700 transition-colors"
                    >Add Dish Choice</button>
                    <button
                      type="button"
                      name="delete-option-btn"
                      className="bg-red-500 text-white w-8 h-8 font-bold hover:bg-red-700 transition-colors"
                      onClick={() => onDeleteOptionClick(id)}
                    >X</button>
                  </div>
                </div>
                  {choices.length !== 0 &&(
                    choices.filter(chioce => chioce.optionId === id).map(choiceId => (
                      <div
                        key={choiceId.id}
                        className="mt-2 ml-10 flex flex-row items-center"
                      >
                        <input
                          ref={register({required: true})}
                          name={`choiceName-${id}-${choiceId.id}`}
                          type="text"
                          placeholder="Choice Name"
                          minLength={2}
                          className="mr-2  input-sm"
                        />
                        <input
                          ref={register({required: true})}
                          name={`choiceExtra-${id}-${choiceId.id}`}
                          type="number"
                          placeholder="Choice Extra"
                          defaultValue={0}
                          min={0}
                          className="mr-2 input-sm"
                        />
                        <button
                          type="button"
                          name="delete-choice-btn"
                          className="bg-red-500 text-white w-8 h-8 font-bold hover:bg-red-700 transition-colors"
                          onClick={() => onDeleteChoiceClick(id, choiceId.id)}
                        >X</button>
                      </div>
                    ))
                  )}
              </div>))
            }
          </div>
          <div className="text-center">
            <button
              type="button"
              onClick={onAddOptionClick}
              className="text-white py-1 px-2 w-1/3 text-center bg-lime-600 hover:bg-lime-700 transition-colors"
            >옵션 추가하기</button>
          </div>
          <Button
            canClick={formState.isValid}
            loading={loading}
            actionText={'Add Dish'}
          />
        </form>
      </Article>
    </div>
  );
};

export default AddDish;
