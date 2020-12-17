import React, { useState } from 'react';
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
import { deleteDish, deleteDishVariables } from './../../__generated__/deleteDish';

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

const DELETE_DISH_MUTATION = gql`
  mutation deleteDish($input: DeleteDishInput!) {
    deleteDish(input: $input) {
      ok
      error
    }
  }
`;

interface IParams {
  id: string;
  dishId: string;
};

const EditDish: React.FC = () => {
  const history = useHistory();
  const { id, dishId } = useParams<IParams>();
  const [isAction, setIsAction] = useState(false);

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

  const [deleteDishMutation, { loading: deleteMutationLoading }] = useMutation<
    deleteDish,
    deleteDishVariables
  >(DELETE_DISH_MUTATION, {
    onCompleted: (data: deleteDish) => {
      const { deleteDish: { ok } } = data;
      if (ok) {
        alert(`정상적으로 삭제되었습니다.`);
        history.push(`/restaurant/${id}`);
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
    if (isAction) { return; }
    if (loading) { return; }

    setIsAction(true);
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
    });
    setIsAction(false);
  };

  const onDeleteClick = () => {
    if (!window.confirm(`정말 삭제하시겠습니까?`)) {
      return;
    }
    if (isAction) { return; }
    setIsAction(true);

    deleteDishMutation({
      variables: {
        input: {
          dishId: +dishId,
        }
      },
      refetchQueries: [{
        ...refetchMyRestaurant(+id)
      }]
    });

    setIsAction(false);
  }

  return (
    <div>
      <Helmet>
        <title>{`Edit Dish | Nuber Eats`}</title>
      </Helmet>
      <Article loading={loading}>
        <h4 className="w-full font-semibold text-center pl-5 text-2xl mb-6">Edit Dish</h4>
        { data?.findDish.dish ? (
          <>
            <DishForm
              onSubmit={onSubmit}
              loading={mutationLoading}
              buttonText={`메뉴 수정`}
              defaultValues={data?.findDish.dish}
            ></DishForm>
            <div className="max-w-screen-sm mx-auto px-5 mb-10">
              <button onClick={onDeleteClick} className="btn-red w-full py-4">
                삭제하기
              </button>
            </div>
          </>
        ) : (
          <h1 className="text-lime-600 text-2xl text-center">
            이미 삭제되거나 수정할 수 없습니다.
          </h1>
        )}
      </Article>
    </div>
  );
};

export default EditDish;
