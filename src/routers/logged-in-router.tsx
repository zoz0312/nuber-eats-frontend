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
import MyRestaurants from '../pages/owner/MyRestaurants';
import AddRestaurant from '../pages/owner/AddRestaurant';
import MyRestaurant from './../pages/owner/MyRestaurant';
import AddDish from '../pages/owner/AddDish';
import Order from '../pages/Order';
import DashBoard from '../pages/driver/DashBoard';
import EditRestaurant from '../pages/owner/EditRestaurant';
import EditDish from '../pages/owner/EditDish';
import EditCategory from '../pages/owner/EditCategory';

const commonRoutes = [
  { path: '/confirm', component: ConfirmEmail },
  { path: '/edit-profile', component: EditProfile },
  { path: '/orders/:id', component: Order },
];
const clientRoutes = [
  { path: '/', component: ClientRestaurants },
  { path: '/search', component: ClientSearch },
  { path: '/category/:slug', component: ClientCategory },
  { path: '/restaurant/:id/', component: ClientRestaurant },
];
const restaurantRoutes = [
  { path: '/', component: MyRestaurants },
  { path: '/edit-category', component: EditCategory },
  { path: '/add-restaurant', component: AddRestaurant },
  { path: '/edit-restaurant/:id/', component: EditRestaurant },
  { path: '/restaurant/:id', component: MyRestaurant },
  { path: '/restaurant/:id/add-dish', component: AddDish },
  { path: '/restaurant/:id/edit-dish/:dishId', component: EditDish },
];
const driverRoutes = [
  { path: '/', component: DashBoard },
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
        { commonRoutes.map(route => (
          <Route exact path={route.path} key={route.path} component={route.component} />
        ))}
        { data.me.role === UserRole.Client && clientRoutes.map(route => (
          <Route exact path={route.path} key={route.path} component={route.component} />
        ))}
        { data.me.role === UserRole.Owner && restaurantRoutes.map(route => (
          <Route exact path={route.path} key={route.path} component={route.component} />
        ))}
        { data.me.role === UserRole.Delivery && driverRoutes.map(route => (
          <Route exact path={route.path} key={route.path} component={route.component} />
        ))}
        <Route component={NotFound}/>
        {/* <Redirect to='/' /> */}
      </Switch>
    </Router>
  )
}

export default LoggedInRouter;
