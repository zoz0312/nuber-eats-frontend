import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
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
}

const AddDish: React.FC = () => {
  const { id } = useParams<IParams>();
  const history = useHistory();

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
  } = useForm<IDishForm>({
    mode: 'onChange',
  });

  const onSubmit = () => {
    // TODO: submit
    if (loading) { return; }
    const { name, price, description } = getValues();
    createDishMutation({
      variables: {
        input: {
          name,
          price: +price,
          description,
          restaurantId: +id,
        }
      }
    });
    history.goBack();
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
