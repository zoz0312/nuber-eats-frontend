import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { UserRole } from '../__generated__/globalTypes';
import { Header } from '../components/Header';
import { useMe } from '../hooks/useMe';
import { NotFound } from '../pages/404';
import ConfirmEmail from '../pages/user/ConfirmEmail';
import EditProfile from '../pages/user/EditProfile';
import ClientSearch from '../pages/client/Search';
import ClientCategory from '../pages/client/Category';
import ClientRestaurants from '../pages/client/Restaurants';
import ClientRestaurant from '../pages/client/Restaurant';

let keyValue = 0;
const ClientRoutes = [
  <Route key={keyValue++} path='/' exact component={ClientRestaurants} />,
  <Route key={keyValue++} path='/confirm' exact component={ConfirmEmail} />,
  <Route key={keyValue++} path='/edit-profile' exact component={EditProfile} />,
  <Route key={keyValue++} path='/search' exact component={ClientSearch} />,
  <Route key={keyValue++} path='/category/:slug' exact component={ClientCategory} />,
  <Route key={keyValue++} path='/restaurant/:id' exact component={ClientRestaurant} />,
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
