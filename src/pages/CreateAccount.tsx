import { gql, useMutation } from '@apollo/client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Button from '../components/Button';
import FormError from '../components/FormError';
import { UserRole } from '../__generated__/globalTypes';
import { createAccountMutation, createAccountMutationVariables } from '../__generated__/createAccountMutation';
import logo from '../images/logo.svg';

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccountMutation($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      ok
      error
    }
  }
`;

interface ICreateAccountForm {
  email: string;
  password: string;
  role: UserRole;
}

const CreateAccount = () => {
  const {
    register,
    getValues,
    errors,
    handleSubmit,
    formState,
  } = useForm<ICreateAccountForm>({
    mode: 'onChange',
    defaultValues: {
      role: UserRole.Client,
    }
  });

  const history = useHistory();
  const onCompleted = (data: createAccountMutation) => {
    const { createAccount: { ok } } = data;
    if (ok) {
      alert('아이디가 생성되었습니다!\n로그인 해주세요!')
      history.push('/');
    }
  }
  const [createAccountMutation, {
    loading,
    data: createAccountMutationResult,
  }] = useMutation<
    createAccountMutation,
    createAccountMutationVariables
  >(CREATE_ACCOUNT_MUTATION, {
    onCompleted,
  });

  const onSubmit = () => {
    if (loading) {
      return;
    }
    const { email, password, role } = getValues();
    createAccountMutation({
      variables: {
        createAccountInput: {
          email,
          password,
          role,
        }
      }
    })
  }

  return (
    <div className="h-screen flex items-center flex-col">
      <Helmet>
        <title>Create Account | Number Eats</title>
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
              pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
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
          { errors.password?.type === 'minLength' && (
            <FormError errorMessage={'비밀번호는 최소 10자 이상이어야 합니다.'} />
          )}
          { errors.password?.message && (
            <FormError errorMessage={errors.password?.message} />
          )}
          <select name="role" ref={register({ required: true })} className="input">
            {Object.keys(UserRole).map((role, index) => <option key={index}>{role}</option>)}
          </select>
          <Button
            canClick={formState.isValid}
            loading={loading}
            actionText={'Create Account'}
          />
          { createAccountMutationResult?.createAccount.error && (
            <FormError errorMessage={createAccountMutationResult?.createAccount.error} />
          )}
        </form>
        <div>
          Already have an account?&nbsp;
          <Link to='/' className="text-lime-600 hover:underline">Login</Link>
        </div>
      </div>
    </div>
  )
}

export default CreateAccount;
