import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { createRestaurant, createRestaurantVariables } from './../../__generated__/createRestaurant';
import { useForm } from 'react-hook-form';
import Button from './../../components/Button';

const CREATE_RESTAURANT_MUTATION = gql`
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      error
      ok
    }
  }
`;

interface IFormProps {
  name: string;
  address: string;
  categoryName: string;
}

const AddRestaurant: React.FC = () => {
  const [createRestaurantResult, { data, loading }] = useMutation<
    createRestaurant,
    createRestaurantVariables
  >(CREATE_RESTAURANT_MUTATION)
  const {
    register,
    getValues,
    formState,
    errors,
    handleSubmit
  } = useForm<IFormProps>({
    mode: 'onChange',
  })
  const onSubmit = () => {
    console.log(getValues());
  };

  return (
    <div>
      <h1>ADD</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          ref={register({required: 'Name is required.'})}
          name="name"
          placeholder="Name"
          type="text"
          required
        />
        <input
          ref={register({required: 'Address is required.'})}
          name="address"
          placeholder="Address"
          type="text"
          required
        />
        <input
          ref={register({required: 'Category Name is required.'})}
          name="category"
          placeholder="Category Name"
          type="text"
          required
        />
        <Button
          loading={loading}
          canClick={formState.isValid}
          actionText={'Create Restaurant'}
        />
      </form>
    </div>
  );
}

export default AddRestaurant;