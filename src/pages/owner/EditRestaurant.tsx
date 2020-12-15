import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useHistory } from 'react-router-dom';
import { refetchMyRestaurant, useMyRestaurant } from '../../hooks/useMyRestaurant';
import { fileUploader } from './../../functions/imageUploader';
import RestaurantForm, { IRestaurantFormProps } from '../../components/RestaurantForm';
import { gql, useMutation } from '@apollo/client';
import { editRestaurant, editRestaurantVariables } from './../../__generated__/editRestaurant';
import Loading from '../../components/Loading';

const EDIT_RESTAURANT_MUTATION = gql`
  mutation editRestaurant($input: EditRestaurantInput!) {
    editRestaurant(input: $input) {
      error
      ok
    }
  }
`;
interface IParams {
  id: string;
};

const EditRestaurant: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<IParams>();
  const { data: myRestaurantData, loading: myRestaurantLoading } = useMyRestaurant(+id);
  const [uploading, setUploading] = useState(false);

  const onCompleted = (data: editRestaurant) => {
    const { editRestaurant: { ok } } = data;
    console.log('ok', ok)
    if (ok) {
      setUploading(false);
      history.push(`/restaurant/${id}`);
    }
  }

  const [editRestaurantMutation, { data }] = useMutation<
    editRestaurant,
    editRestaurantVariables
  >(EDIT_RESTAURANT_MUTATION, {
    onCompleted,
    refetchQueries: [{
      ...refetchMyRestaurant(+id)
    }]
  });

  const onSubmit = async ({
    file,
    name,
    categoryName,
    address,
  }: IRestaurantFormProps) => {
    setUploading(true);
    try {
      let coverImage;
      if (file[0]) {
        coverImage = await fileUploader(file[0]);
      } else {
        if (myRestaurantData?.myRestaurant.restaurant?.coverImage) {
          coverImage = myRestaurantData?.myRestaurant.restaurant?.coverImage;
        }
      }
      editRestaurantMutation({
        variables: {
          input: {
            restaurantId: +id,
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
    <div>
      <Helmet>
        <title>Edit Restaurants | Nuber Eats</title>
      </Helmet>
      <div className="w-full mt-10 lg:mt-32 max-w-screen-sm flex flex-col items-center mx-auto">
        <h4 className="w-full font-semibold text-center pl-5 text-2xl mb-6">Edit Restaurant</h4>
        { myRestaurantLoading ? (
          <Loading />
        ) : (
          <RestaurantForm
            onSubmit={onSubmit}
            loading={uploading}
            defaultValues={{
              name: myRestaurantData?.myRestaurant.restaurant?.name,
              address: myRestaurantData?.myRestaurant.restaurant?.address,
              categoryName: myRestaurantData?.myRestaurant.restaurant?.category?.name,
            }}
            buttonText={`Edit Restaurant`}
          >
          </RestaurantForm>
        )}
      </div>
    </div>
  )
};

export default EditRestaurant;
