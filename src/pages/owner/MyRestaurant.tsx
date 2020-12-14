import React, { useEffect } from 'react';
import { gql, useQuery, useMutation, useSubscription } from '@apollo/client';
import { Link, useParams, useHistory } from 'react-router-dom';
import { RESTUARANT_FRAGMENT, DISH_FRAGMENT, ORDERS_FRAGMENT, FULL_ORDER_FRAMGENT } from './../../fragments';
import { myRestaurant, myRestaurantVariables } from './../../__generated__/myRestaurant';
import { Helmet } from 'react-helmet-async';
import Article from '../../components/Article';
import Dish from './../../components/Dish';
import { VictoryChart, VictoryBar, VictoryAxis, VictoryVoronoiContainer, VictoryLine, VictoryZoomContainer, VictoryTheme, VictoryLabel } from 'victory';
import { createPayment, createPaymentVariables } from './../../__generated__/createPayment';
import { pendingOrders } from './../../__generated__/pendingOrders';

export const MY_RESTAURANT_QUERY = gql`
  query myRestaurant($input: MyRestaurantInput!) {
    myRestaurant(input:$input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
        orders {
          ...OrderParts
        }
      }
    }
  }
  ${RESTUARANT_FRAGMENT}
  ${DISH_FRAGMENT}
  ${ORDERS_FRAGMENT}
`;

const CREATE_PAYMENT_MUTATION = gql`
  mutation createPayment($input: CreatePaymentInput!) {
    createPayment(input: $input) {
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
  const { data, loading } = useQuery<
    myRestaurant,
    myRestaurantVariables
  >(MY_RESTAURANT_QUERY, {
      variables: {
        input: {
        id: +id,
      }
    }
  });

  const onCompleted = (data: createPayment) => {
    if (data.createPayment) {
      alert('Your restaurant is being promoted!');
    }
  }

  const [createPaymentMutation, { loading: paymentLoading }] = useMutation<
    createPayment,
    createPaymentVariables
  >(CREATE_PAYMENT_MUTATION, {
    onCompleted
  });

  const triggerPaddle = () => {
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

  const { data:subscriptionData } = useSubscription<pendingOrders>(PENDING_ORDERS_SUBSCRIPTION);
  const history = useHistory();

  useEffect(() => {
    if (subscriptionData?.pendingOrders.id) {
      history.push(`/orders/${subscriptionData?.pendingOrders.id}`)
    }
  }, [subscriptionData])

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
        <div className="my-3">
          <Link
            to={`/restaurant/${id}/add-dish`}
            className="mr-8 text-white bg-gray-800 hover:bg-gray-700 transition-colors py-3 px-10"
          >Add Dish &rarr;</Link>
          { data?.myRestaurant.restaurant?.isPromoted ? (
            <div className="inline-block text-lime-700">Is Already Promotted!</div>
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
            <div className="text-xl mb-5">You have no dishies</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-x-7 gap-y-4">
            { data?.myRestaurant.restaurant?.menu.map((dish, index) => (
              <Dish key={index} menu={dish} />
            ))}
            </div>
          )}
        </div>
        <div className="mt-20">
          <h4 className="text-center text-xl font-medium">Sales</h4>
          <div className="pb-20">
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
      </Article>
    </div>
  );
};

export default MyRestaurant;
