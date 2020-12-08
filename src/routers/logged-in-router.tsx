import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { isLoggedInVar } from '../apollo';
import { meQuery, meQuery_me } from '../__generated__/meQuery';

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
    <div>
      <span>{ data.me.email }</span>
    </div>
  )
}

export default LoggedInRouter;
