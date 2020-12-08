import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import Login from '../pages/Login';
import CreateAccount from '../pages/CreateAccount';
import { NotFound } from '../pages/404';

const LoggedOutRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path='/create-account' exact component={CreateAccount}/>
        <Route path='/' exact component={Login}/>
        <Route component={NotFound}/>
      </Switch>
    </Router>
  )
}

export default LoggedOutRouter;
