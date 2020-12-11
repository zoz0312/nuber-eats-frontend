import { gql, useMutation } from '@apollo/client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Button from '../components/Button';
import FormError from '../components/FormError';
import { loginMutation, loginMutationVariables } from '../__generated__/loginMutation';
import { authTokenVar, isLoggedInVar } from '../apollo';
import { EMAIL_PATTERN, LOCALSTORAGE_TOKEN } from '../constants';
import logo from '../images/logo.svg';

export const LOGIN_MUTATION = gql`
  mutation loginMutation($email: String!, $password: String!) {
    login(input: {
      email: $email,
      password: $password
    }) {
      ok
      error
      token
    }
  }
`;

interface ILoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const {
    register,
    getValues,
    errors,
    handleSubmit,
    formState,
  } = useForm<ILoginForm>({
    mode: 'onChange'
  });

  const onCompleted = (data: loginMutation) => {
    const { login: { ok, token } } = data;
    if (ok && token) {
      localStorage.setItem(LOCALSTORAGE_TOKEN, token);
      authTokenVar(token);
      isLoggedInVar(true);
    }
  }

  const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
    loginMutation,
    loginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted,
  });

  const onSubmit = () => {
    if (loading) {
      return;
    }
    const { email, password } = getValues();
    loginMutation({
      variables: {
        email,
        password,
      }
    })
  }

  return (
    <div className="h-screen flex items-center flex-col">
      <Helmet>
        <title>Login | Nuber Eats</title>
      </Helmet>
      <div className="w-full mt-10 lg:mt-32 max-w-screen-sm flex flex-col items-center">
        <img src={logo} className="w-60 h-16 mb-3" />
        <h4 className="w-full font-semibold text-left pl-5 text-2xl mb-6">Welcome back</h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-5 my-5 px-5 w-full"
        >
          <input
            ref={register({
              required: 'Email is required',
              pattern: EMAIL_PATTERN,
            })}
            name="email"
            type="email"
            placeholder="Email"
            className="input"
          />
          { errors.email?.message && (
            <FormError errorMessage={errors.email?.message} />
          )}
          { errors.email?.type === 'pattern' && (
            <FormError errorMessage={`Please enter a valid email`} />
          )}
          <input
            ref={register({
              required: 'Password is required',
              minLength: 5,
            })}
            name="password"
            type="password"
            placeholder="Password"
            className="input"
          />
          {/* { errors.password?.type === 'minLength' && (
            <FormError errorMessage={'비밀번호는 최소 10자 이상이어야 합니다.'} />
          )} */}
          { errors.password?.message && (
            <FormError errorMessage={errors.password?.message} />
          )}
          <Button
            canClick={formState.isValid}
            loading={loading}
            actionText={'Login'}
          />
          { loginMutationResult?.login.error && (
            <FormError errorMessage={loginMutationResult?.login.error} />
          )}
        </form>
        <div>
          New to Nuber? <Link to='/create-account' className="text-lime-600 hover:underline">Create Account</Link>
        </div>
      </div>
    </div>
  )
}

export default Login;
