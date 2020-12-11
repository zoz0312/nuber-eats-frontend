import { gql, useApolloClient, useMutation } from '@apollo/client';
import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useMe } from '../../hooks/useMe';
import { verifyEmail, verifyEmailVariables } from '../../__generated__/verifyEmail';

export const VERIFY_EMAIL_MUTATION = gql`
  mutation verifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`;

const ConfirmEmail: React.FC = () => {
  const client = useApolloClient();
  const { data: userData, refetch } = useMe();
  const history = useHistory();

  const onCompleted = async (data: verifyEmail) => {
    const { verifyEmail: { ok } } = data;
    if (ok && userData?.me.id) {
      await refetch();
      history.push('/')
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
    });
  }, []);

  return (
    <div className="mt-52 flex flex-col justify-center items-center">
      <h2 className="text-lg font-bold">Confirming Email...</h2>
      <h4 className="text-sm font-medium">Please wait, don't close this page...</h4>
    </div>
  );
}

export default ConfirmEmail;
