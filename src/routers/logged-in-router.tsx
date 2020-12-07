import React from 'react';
import { isLoggedInVar } from '../apollo';

const LoggedInRouter = () => {
  return (
    <div>
      <span>LoggedInRouter</span>
      <button onClick={() => isLoggedInVar(false)}>Click to login</button>
    </div>
  )
}

export default LoggedInRouter;
