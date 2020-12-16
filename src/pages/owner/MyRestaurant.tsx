import React, { useEffect } from 'react';
import { gql, useMutation, useSubscription } from '@apollo/client';
import { Link, useParams, useHistory } from 'react-router-dom';
import { FULL_ORDER_FRAMGENT } from './../../fragments';
import { Helmet } from 'react-helmet-async';
import Article from '../../components/Article';
import Dish from './../../components/Dish';
import { VictoryChart, VictoryAxis, VictoryVoronoiContainer, VictoryLine, VictoryTheme, VictoryLabel } from 'victory';
import { createPayment, createPaymentVariables } from './../../__generated__/createPayment';
import { pendingOrders } from './../../__generated__/pendingOrders';
import { useMyRestaurant } from '../../hooks/useMyRestaurant';
import { MY_RESTAURANT_QUERY } from './../../hooks/useMyRestaurant';
import { deleteRestaurant, deleteRestaurantVariables } from './../../__generated__/deleteRestaurant';
import { NotFound } from './../404';

const CREATE_PAYMENT_MUTATION = gql`
  mutation createPayment($input: CreatePaymentInput!) {
    createPayment(input: $input) {
      ok
      error
    }
  }
`;

const DELETE_RESTAURANT_MUTATION = gql`
  mutation deleteRestaurant($input: DeleteRestaurantInput!) {
    deleteRestaurant(input: $input) {
      ok
      error
    }
  }
`;

const PENDING_ORDERS_SUBSCRIPTION = gql`
  subscription pendingOrders {
    pendingOrders {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAMGENT}
`;

interface IParams {
  id: string;
}

const MyRestaurant: React.FC = () => {
  const { id } = useParams<IParams>();
  const { data, loading } = useMyRestaurant(+id);

  const onCompleted = (data: createPayment) => {
    if (data.createPayment) {
      alert('Your restaurant is being promoted!');
    }
  }

  const [createPaymentMutation] = useMutation<
    createPayment,
    createPaymentVariables
  >(CREATE_PAYMENT_MUTATION, {
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

  const [deleteRestaurantMutation] = useMutation<
    deleteRestaurant,
    deleteRestaurantVariables
  >(DELETE_RESTAURANT_MUTATION, {
    onCompleted: (data: deleteRestaurant) => {
      const { deleteRestaurant: { ok } } = data;
      if (ok) {
        alert('정상적으로 삭제되었습니다.');
        history.push('/');
      }
    }
  });

  const triggerPaddle = async () => {
    // TODO: paddle Payment
    const paddleSampleData = {
      checkout: { id: 1 }
    };

    createPaymentMutation({
      variables: {
        input: {
          transactionId: paddleSampleData.checkout.id,
          restaurantId: +id,
        }
      }
    });
  };

  const deleteRestaurant = () => {
    if (window.confirm('정말로 식당을 삭제하시겠습니까?')) {
      deleteRestaurantMutation({
        variables: {
          input: {
            restaurantId: +id,
          }
        }
      })
    }
  }

  const { data:subscriptionData } = useSubscription<pendingOrders>(PENDING_ORDERS_SUBSCRIPTION);
  const history = useHistory();

  useEffect(() => {
    if (subscriptionData?.pendingOrders.id) {
      history.push(`/orders/${subscriptionData?.pendingOrders.id}`)
    }
  }, [subscriptionData, history]);

  if (!loading && !data?.myRestaurant.ok) {
    return <NotFound />
  }
  return (
    <div>
      <Helmet>
        {`My Restaurant | Nuber Eats`}
      </Helmet>
      <header>
        <div
          className="bg-gray-700 py-28 bg-cover bg-center"
          style={{
            backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImage})`
          }}
        >
        </div>
      </header>
      <Article loading={loading}>
        <div className="text-4xl font-medium mb-10">
          {data?.myRestaurant.restaurant?.name}
        </div>
        <div className="my-3 flex items-center">
          <button
            type="button"
            className="btn-black mr-5"
          >
            <Link
              to={`/edit-restaurant/${id}`}
            >Edit Restaurant &rarr;</Link>
          </button>
          <button
            type="button"
            className="btn-black mr-5"
          >
            <Link
              to={`/restaurant/${id}/add-dish`}
            >Add Dish &rarr;</Link>
          </button>
          { data?.myRestaurant.restaurant?.isPromoted ? (
            <div className="inline-block text-lime-700 my-3">Is Already Promotted!</div>
          ) : (
            <button
              type="button"
              onClick={triggerPaddle}
              className="text-white bg-lime-700 py-3 px-10"
            >
              Buy Promition &rarr;
            </button>
          )}
        </div>
        <div className="mt-10">
          {data?.myRestaurant.restaurant?.menu.length === 0 ? (
            <div className="text-xl mb-5 text-lime-600">메뉴가 없습니다.</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-x-7 gap-y-4">
            { data?.myRestaurant.restaurant?.menu.map((dish, index) => (
              <Link to={`/restaurant/${id}/edit-dish/${dish.id}`}>
                <Dish key={index} menu={dish} />
              </Link>
            ))}
            </div>
          )}
        </div>
        <div className="mt-20">
          <h4 className="text-center text-xl font-medium">Sales</h4>
          <div className="pb-10">
            <VictoryChart
              width={window.innerWidth}
              height={500}
              theme={VictoryTheme.material}
              containerComponent={<VictoryVoronoiContainer />}
            >
              <VictoryLine
                data={data?.myRestaurant.restaurant?.orders.map(order => ({
                  x: order.createdAt,
                  y: order.total,
                }))}
                interpolation="linear"
                style={{
                  data: {
                    stroke: 'green',
                    strokeWidth: 5,
                  }
                }}
                labels={({ datum }) => `${datum.y} $`}
                labelComponent={
                  <VictoryLabel
                    style={{ fontSize: 17 }}
                    renderInPortal
                    dy={-20}
                  />}
              />
              <VictoryAxis
                style={{tickLabels: {
                  fontSize: 15,
                  fill: "#4D7C0F",
                }}}
                dependentAxis
                tickFormat={tick => (
                  `${tick} $`
                )}
              />
              <VictoryAxis
                style={{tickLabels:{
                  fontSize: 15,
                }}}
                label="Days"
                tickFormat={tick => (
                  new Date(tick).toLocaleDateString('ko')
                )}
              />
            </VictoryChart>
          </div>
        </div>
        <div className="my-5 flex justify-start">
          <button
            onClick={deleteRestaurant}
            type="button"
            className="underline text-white bg-red-400 hover:bg-red-500 w-4/12 text-center py-2 transition-colors focus:outline-none"
          >
            식당 삭제하기
          </button>
        </div>
      </Article>
    </div>
  );
};

export default MyRestaurant;
