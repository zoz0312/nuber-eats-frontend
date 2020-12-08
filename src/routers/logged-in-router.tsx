import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import Restaurants from '../pages/client/Restaurants';
import { UserRole } from '../__generated__/globalTypes';
import { Header } from '../components/Header';
import { useMe } from '../hooks/useMe';

const ClientRoutes = [
  <Route path='/' exact component={Restaurants} />,
];

const LoggedInRouter = () => {
  const { data, loading, error } = useMe();
  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="text-xl font-medium tracking-wide">Loading..</span>
      </div>
    );
  }
  return (
    <Router>
      <Header />
      <Switch>
        { data.me.role === UserRole.Client && ClientRoutes}
        <Redirect to='/' />
      </Switch>
    </Router>
  )
}

export default LoggedInRouter;
