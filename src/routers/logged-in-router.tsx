import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import Restaurants from '../pages/client/Restaurants';
import { UserRole } from '../__generated__/globalTypes';
import { meQuery } from '../__generated__/meQuery';

const ClientRoutes = [
  <Route path='/' exact component={Restaurants} />,
];


const ME_QUERY = gql`
  query meQuery {
    me {
      id
      email
      role
      verified
    }
  }
`

const LoggedInRouter = () => {
  const { data, loading, error } = useQuery<meQuery>(ME_QUERY);
  console.log('error', error);
  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="text-xl font-medium tracking-wide">Loading..</span>
      </div>
    );
  }
  return (
    <Router>
      <Switch>
        { data.me.role === UserRole.Client && ClientRoutes}
        <Redirect to='/' />
      </Switch>
    </Router>
  )
}

export default LoggedInRouter;
