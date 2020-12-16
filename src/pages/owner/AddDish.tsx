import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import { createDish, createDishVariables } from './../../__generated__/createDish';
import Article from '../../components/Article';
import { Helmet } from 'react-helmet-async';
import { fileUploader } from './../../functions/imageUploader';
import { MY_RESTAURANT_QUERY, refetchMyRestaurant } from './../../hooks/useMyRestaurant';
import DishForm, { IDishFormArgument, IDishFormChoices, IDishFormProps } from './../../components/DishForm';

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

const AddDish: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<IParams>();

  const onCompleted = (data: createDish) => {
    const { createDish: { ok } } = data;
    if (ok) {
      // TODO: something
      history.goBack();
    }
  };

  const [createDishMutation, { loading }] = useMutation<
    createDish,
    createDishVariables
  >(CREATE_DISH_MUTATION, {
    onCompleted,
    refetchQueries: [{
      ...refetchMyRestaurant(+id)
    }]
  });

  const onSubmit = async (
    {
      name,
      price,
      description,
      file,
      dishOptions,
    }: IDishFormArgument,
  ) => {
    if (loading) { return; }

    const photo = await fileUploader(file[0]);

    createDishMutation({
      variables: {
        input: {
          name,
          price: +price,
          description,
          photo,
          restaurantId: +id,
          options: dishOptions,
        }
      }
    });
  };

  return (
    <div>
      <Helmet>
        {`Create Dish | Nuber Eats`}
      </Helmet>
      <Article loading={loading}>
        <h4 className="w-full font-semibold text-center pl-5 text-2xl mb-6">Add Dish</h4>
        <DishForm
          onSubmit={onSubmit}
          loading={loading}
          buttonText={`Add Dish`}
        ></DishForm>
      </Article>
    </div>
  );
};

export default AddDish;
