import { gql, useMutation } from '@apollo/client';
import React from 'react';
import { useForm } from 'react-hook-form';
import FormError from '../components/FormError';
import { loginMutation, loginMutationVariables } from '../__generated__/loginMutation';


const LOGIN_MUTATION = gql`
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
  const { register, getValues, errors, handleSubmit } = useForm<ILoginForm>();
  const [loginMutation] = useMutation<
    loginMutation,
    loginMutationVariables
  >(LOGIN_MUTATION);

  const onSubmit = () => {
    const { email, password } = getValues();
    loginMutation({
      variables: {
        email,
        password,
      }
    })
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-800">
      <div className="bg-white w-full max-w-lg py-5 rounded-lg text-center">
        <h3 className="text-3xl text-gray-800">Login</h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-5 mt-5 px-5"
        >
          <input
            ref={register({ required: 'Email is required' })}
            name="email"
            type="email"
            placeholder="Email"
            className="input"
          />
          { errors.email?.message && (
            <FormError errorMessage={errors.email?.message} />
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
          <button className="btn-login">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login;
