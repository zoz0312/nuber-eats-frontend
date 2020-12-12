import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { createRestaurant, createRestaurantVariables } from './../../__generated__/createRestaurant';
import { useForm } from 'react-hook-form';
import Button from './../../components/Button';
import { Helmet } from 'react-helmet-async';
import FormError from '../../components/FormError';
import { useHistory } from 'react-router-dom';

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
  file: FileList;
}

const AddRestaurant: React.FC = () => {
  // const client = useApolloClient();

  const history = useHistory();
  const [uploading, setUploading] = useState(false);
  const onCompleted = (data: createRestaurant) => {
    const { createRestaurant: { ok } } = data;
    if (ok) {
      setUploading(false);

      // cache 최적화
      // useEffect(() => {
      //   const queryResult = client.readQuery({
      //     query: MY_RESTAURANTS_QUERY
      //   });
      //   client.writeQuery({
      //     query: MY_RESTAURANTS_QUERY,
      //     data: {
      //       ...queryResult.myRestaurants,
      //       restaurants: [1,2,3,4,5,6]
      //     }
      //   })
      //   console.log('queryResult', queryResult);
      // }, []);
      // history.push('/');
    }
  };

  const [createRestaurantMutation, { data }] = useMutation<
    createRestaurant,
    createRestaurantVariables
  >(CREATE_RESTAURANT_MUTATION, {
    onCompleted,
  });
  // refetchQueries: [{ query: MY_RESTAURANTS_QUERY }]

  const {
    register,
    getValues,
    formState,
    errors,
    handleSubmit
  } = useForm<IFormProps>({
    mode: 'onChange',
  });

  const onSubmit = async () => {
    if (uploading) { return };
    setUploading(true);
    try {
      const { file, name, categoryName, address } = getValues();
      const actualFile = file[0];
      const formBody = new FormData();
      formBody.append('file', actualFile);
      const { url: coverImage } = await (
        await fetch('http://192.168.219.200:4000/uploads', {
          method: 'POST',
          body: formBody
        })
      ).json();
      createRestaurantMutation({
        variables: {
          input: {
            name,
            categoryName,
            address,
            coverImage,
          }
        }
      });
    } catch (e) {
      console.log('e', e)
    }
  };

  return (
    <div className="h-screen flex items-center flex-col">
      <Helmet>
        <title>Add Restaurant | Nuber Eats</title>
      </Helmet>
      <div className="w-full mt-10 lg:mt-32 max-w-screen-sm flex flex-col items-center">
      <h4 className="w-full font-semibold text-center pl-5 text-2xl mb-6">Add Restaurant</h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-5 my-5 px-5 w-full"
        >
          <input
            ref={register({required: 'Name is required.'})}
            className="input"
            name="name"
            placeholder="Name"
            type="text"
            required
          />
          <input
            ref={register({required: 'Address is required.'})}
            className="input"
            name="address"
            placeholder="Address"
            type="text"
            required
          />
          <input
            ref={register({required: 'Category Name is required.'})}
            className="input"
            name="categoryName"
            placeholder="Category Name"
            type="text"
            required
          />
          <div>
            <input
              type="file"
              name="file"
              accept="image/*"
              ref={register({ required: true })}
            />
          </div>
          <Button
            loading={uploading}
            canClick={formState.isValid}
            actionText={'Create Restaurant'}
          />
          { data?.createRestaurant.error && (
            <FormError errorMessage={data.createRestaurant.error} />
          )}
        </form>
      </div>
    </div>
  );
}

export default AddRestaurant;