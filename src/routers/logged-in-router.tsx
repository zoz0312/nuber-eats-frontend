import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Restaurants from '../pages/client/Restaurants';
import { UserRole } from '../__generated__/globalTypes';
import { Header } from '../components/Header';
import { useMe } from '../hooks/useMe';
import { NotFound } from '../pages/404';
import ConfirmEmail from '../pages/user/ConfirmEmail';
import EditProfile from '../pages/user/EditProfile';
import Search from '../pages/client/Search';
import Category from '../pages/client/Category';

let keyValue = 0;
const ClientRoutes = [
  <Route key={keyValue++} path='/' exact component={Restaurants} />,
  <Route key={keyValue++} path='/confirm' exact component={ConfirmEmail} />,
  <Route key={keyValue++} path='/edit-profile' exact component={EditProfile} />,
  <Route key={keyValue++} path='/search' exact component={Search} />,
  <Route key={keyValue++} path='/category/:slug' exact component={Category} />,
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
