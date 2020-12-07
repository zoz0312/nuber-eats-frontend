import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from '../pages/Login';
import CreateAccount from '../pages/CreateAccount';

const LoggedOutRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path='/create-account' component={CreateAccount}/>
        <Route path='/' component={Login}/>
      </Switch>
    </Router>
  )
}

export default LoggedOutRouter;
