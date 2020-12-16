import React from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useHistory, useParams } from 'react-router-dom';
import { editDish, editDishVariables } from './../../__generated__/editDish';
import { refetchMyRestaurant } from '../../hooks/useMyRestaurant';
import DishForm, { IDishFormArgument, IDishFormChoices, IDishFormProps } from './../../components/DishForm';
import { DISH_FRAGMENT } from './../../fragments';
import { findDish, findDishVariables } from './../../__generated__/findDish';
import { Helmet } from 'react-helmet';
import Article from '../../components/Article';
import { fileUploader } from './../../functions/imageUploader';

const EDIT_DISH_MUTATION = gql`
  mutation editDish($input: EditDishInput!) {
    editDish(input: $input) {
      ok
      error
    }
  }
`;

const FIND_DISH_QUERY = gql`
  query findDish($input: DishInput!) {
    findDish(input: $input) {
      ok
      error
      dish {
        ...DishParts
      }
    }
  }
  ${DISH_FRAGMENT}
`;

interface IParams {
  id: string;
  dishId: string;
};

const EditDish: React.FC = () => {
  const history = useHistory();
  const { id, dishId } = useParams<IParams>();

  const [editDishMutation, { loading: mutationLoading }] = useMutation<
    editDish,
    editDishVariables
  >(EDIT_DISH_MUTATION, {
    onCompleted: (data: editDish) => {
      const { editDish: { ok } } = data;
      if (ok) {
        history.push(`/restaurant/${id}`);
      }
    },
    refetchQueries: [{
      ...refetchMyRestaurant(+id)
    }]
  });

  const { data, loading } = useQuery<
    findDish,
    findDishVariables
  >(FIND_DISH_QUERY, {
    variables: {
      input: {
        id: +dishId
      }
    }
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

    let photo: string;
    if (file[0]) {
      photo = await fileUploader(file[0]);
    } else {
      if (data?.findDish.dish?.photo) {
        photo = data?.findDish.dish?.photo;
      } else {
        photo = '';
      }
    }

    editDishMutation({
      variables: {
        input: {
          dishId: +dishId,
          name,
          price: +price,
          description,
          photo,
          options: dishOptions,
        }
      }
    })
  };

  return (
    <div>
      <Helmet>
        {`Edit Dish | Nuber Eats`}
      </Helmet>
      <Article loading={loading}>
        <h4 className="w-full font-semibold text-center pl-5 text-2xl mb-6">Edit Dish</h4>
        { data?.findDish.dish ? (
          <DishForm
            onSubmit={onSubmit}
            loading={mutationLoading}
            buttonText={`Edit Dish`}
            defaultValues={data?.findDish.dish}
          ></DishForm>
        ) : (
          <div>
            수정할 수 없습니다.
          </div>
        )}
      </Article>
    </div>
  );
};

export default EditDish;
