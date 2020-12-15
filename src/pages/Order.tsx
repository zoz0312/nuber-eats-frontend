import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { gql, useQuery, useMutation } from '@apollo/client';
import { getOrder, getOrderVariables } from './../__generated__/getOrder';
import { Helmet } from 'react-helmet';
import Article from '../components/Article';
import { FULL_ORDER_FRAMGENT } from './../fragments';
import { orderUpdates } from './../__generated__/orderUpdates';
import { useMe } from '../hooks/useMe';
import { OrderStatus, UserRole } from '../__generated__/globalTypes';
import { editOrder, editOrderVariables } from './../__generated__/editOrder';

export const GET_ORDER = gql`
  query getOrder($input: GetOrderInput!) {
    getOrder(input: $input) {
      ok
      error
      order {
        ...FullOrderParts
      }
    }
  }
  ${FULL_ORDER_FRAMGENT}
`;

const ORDER_SUBSCRIPTION = gql`
  subscription orderUpdates($input: OrderUpdatesInput!) {
    orderUpdates(input: $input) {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAMGENT}
`;

const EDIT_ORDER = gql`
  mutation editOrder($input: EditOrderInput!) {
    editOrder(input: $input) {
      ok
      error
    }
  }
`;

interface IParams {
  id: string;
}

const Order: React.FC = () => {
  const { data: userData } = useMe();
  const { id } = useParams<IParams>();

  const [editOrderMutation] = useMutation<
    editOrder,
    editOrderVariables
  >(EDIT_ORDER);

  const { data, loading, subscribeToMore } = useQuery<
    getOrder,
    getOrderVariables
  >(GET_ORDER, {
    variables: {
      input: {
        id: +id,
      }
    }
  });

  useEffect(() => {
    if (data?.getOrder.ok) {
      subscribeToMore({
        document: ORDER_SUBSCRIPTION,
        variables: {
          input: {
            id: +id,
          },
        },
        updateQuery: (prev,
          { subscriptionData:{ data } }: { subscriptionData: { data: orderUpdates } }
        ) => {
          if (!data) {
            return prev;
          }
          return {
            getOrder: {
              ...prev.getOrder,
              order: {
                ...data.orderUpdates
              }
            }
          }
        }
      })
    }
  }, [data, id, subscribeToMore]);

  // const { data: subscriptionData, loading: subscriptionLoading } = useSubscription<
  //   orderUpdates,
  //   orderUpdatesVariables
  // >(ORDER_SUBSCRIPTION, {
  //   variables: {
  //     input: {
  //       id: +id,
  //     }
  //   }
  // })

  const onButtonClick = (newStatus: OrderStatus) => {
    editOrderMutation({
      variables: {
        input: {
          id: +id,
          status: newStatus,
        }
      }
    })
  }
  return (
    <div>
      <Helmet>
        <title>{`Order #${id} | Nuber Eats`}</title>
      </Helmet>
      <Article loading={loading}>
        <div className="border border-lime-700 w-full mt-10 lg:mt-32 max-w-screen-sm flex flex-col items-center mx-auto">
          <div className="bg-lime-600 w-full flex items-center justify-center">
            <h4 className="text-white text-2xl py-5">Order #{ id }</h4>
          </div>
          <div className="flex flex-col w-full p-10">
            <div className="px-5 pb-10 border-b border-lime-700 text-center text-3xl font-bold">${ data?.getOrder.order?.total }</div>
            <div className="px-5 py-3 border-b border-lime-700">
              <span className="text-gray-700">음식점: </span>{ data?.getOrder.order?.restaurant?.name }
            </div>
            <div className="px-5 py-3 border-b border-lime-700">
              <span className="text-gray-700">목적지: </span>{ data?.getOrder.order?.customer?.email }
            </div>
            <div className="px-5 py-3 border-b border-lime-700">
              <span className="text-gray-700">배달원: </span>{ data?.getOrder.order?.driver?.email ? (data?.getOrder.order?.driver?.email) : '배정되지 않았습니다.' }
            </div>
            {userData?.me.role === UserRole.Owner && (
              <div className="w-full mt-5">
                { data?.getOrder.order?.status === OrderStatus.Pending && (
                  <button className="btn w-full" onClick={() => onButtonClick(OrderStatus.Cooking)}>주문 받기</button>
                )}
                { data?.getOrder.order?.status === OrderStatus.Cooking && (
                  <button className="btn w-full" onClick={() => onButtonClick(OrderStatus.Cooked)}>요리 완료</button>
                )}
              </div>
            )}

            {userData?.me.role === UserRole.Delivery && (
              <div className="w-full mt-5">
                { data?.getOrder.order?.status === OrderStatus.Cooked && (
                  <button className="btn w-full" onClick={() => onButtonClick(OrderStatus.PickedUp)}>픽업 하기</button>
                )}
                { data?.getOrder.order?.status === OrderStatus.PickedUp && (
                  <button className="btn w-full" onClick={() => onButtonClick(OrderStatus.Delivered)}>배달 완료</button>
                )}
              </div>
            )}
            <div className="text-center pt-10">
              <span className="text-lime-600 text-3xl">Status: { data?.getOrder.order?.status }</span>
            </div>
            {data?.getOrder.order?.status === OrderStatus.Delivered && (
              <div className="text-center pt-10">
                <span className="text-lime-600 text-3xl">이용해주셔서 감사합니다!</span>
              </div>
            )}
          </div>
        </div>
      </Article>
    </div>
  );
}

export default Order;
