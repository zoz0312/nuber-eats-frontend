import { gql, useApolloClient, useMutation } from '@apollo/client';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useMe } from '../../hooks/useMe';
import { verifyEmail, verifyEmailVariables } from '../../__generated__/verifyEmail';

const VERIFY_EMAIL_MUTATION = gql`
  mutation verifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`;

const ConfirmEmail: React.FC = () => {
  const { data: userData } = useMe();
  const client = useApolloClient();
  const onCompleted = (data: verifyEmail) => {
    const { verifyEmail: { ok } } = data;
    if (ok && userData?.me.id) {
      client.writeFragment({
        id: `User:${userData.me.id}`,
        fragment: gql`
          fragment VerifyedUser on User {
            verified
          }
        `,
        data: {
          verified: true
        },
      })
    }
  };

  const [verifyEmail, { loading: verifingEmail }] = useMutation<
    verifyEmail,
    verifyEmailVariables
  >(VERIFY_EMAIL_MUTATION, {
    onCompleted
  });

  useEffect(() => {
    const [_, code] = window.location.href.split('code=');
    verifyEmail({
      variables: {
        input: {
          code,
        }
      }
    })
  }, []);

  return (
    <div className="mt-52 flex flex-col justify-center items-center">
      <h2 className="text-lg font-bold">Confirming Email...</h2>
      <h4 className="text-sm font-medium">Please wait, don't close this page...</h4>
    </div>
  );
}

export default ConfirmEmail;
