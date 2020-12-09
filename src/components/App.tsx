import { useReactiveVar } from '@apollo/client';
import React from 'react';
import LoggedInRouter from '../routers/logged-in-router';
import LoggedOutRouter from '../routers/logged-out-router';
import { isLoggedInVar } from '../apollo';


const App = () => {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  return (
    <div>
      { isLoggedIn ? <LoggedInRouter /> : <LoggedOutRouter /> }
    </div>
  );
}

export default App;
