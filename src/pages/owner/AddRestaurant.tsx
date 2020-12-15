import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { createRestaurant, createRestaurantVariables } from '../../__generated__/createRestaurant';
import { Helmet } from 'react-helmet-async';
import FormError from '../../components/FormError';
import { useHistory } from 'react-router-dom';
import { fileUploader } from '../../functions/imageUploader';
import RestaurantForm, { IRestaurantFormProps } from '../../components/RestaurantForm';

const CREATE_RESTAURANT_MUTATION = gql`
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      error
      ok
    }
  }
`;

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
      history.push('/');
    }
  };

  const [createRestaurantMutation, { data }] = useMutation<
    createRestaurant,
    createRestaurantVariables
  >(CREATE_RESTAURANT_MUTATION, {
    onCompleted,
  });
  // refetchQueries: [{ query: MY_RESTAURANTS_QUERY }]

  const onSubmit = async ({
    file,
    name,
    categoryName,
    address
  }: IRestaurantFormProps) => {
    setUploading(true);

    try {
      const coverImage = await fileUploader(file[0]);
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
        <RestaurantForm
          onSubmit={onSubmit}
          loading={uploading}
        >
          { data?.createRestaurant.error && (
            <FormError errorMessage={data.createRestaurant.error} />
          )}
        </RestaurantForm>
      </div>
    </div>
  );
}

export default AddRestaurant;