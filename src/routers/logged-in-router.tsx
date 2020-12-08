import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import Restaurants from '../pages/client/Restaurants';
import { UserRole } from '../__generated__/globalTypes';
import { Header } from '../components/Header';
import { useMe } from '../hooks/useMe';
import { NotFound } from '../pages/404';
import ConfirmEmail from '../pages/user/ConfirmEmail';
import EditProfile from '../pages/user/EditProfile';

const ClientRoutes = [
  <Route key={1} path='/' exact component={Restaurants} />,
  <Route key={2} path='/confirm' exact component={ConfirmEmail} />,
  <Route key={3} path='/edit-profile' exact component={EditProfile} />,
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
        <Route component={NotFound}/>
        {/* <Redirect to='/' /> */}
      </Switch>
    </Router>
  )
}

export default LoggedInRouter;
