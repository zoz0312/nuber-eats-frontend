import React from 'react';
import { useForm } from 'react-hook-form';

interface ILoginForm {
  email?: string;
  password?: string;
}

const Login = () => {
  const { register, getValues, errors, handleSubmit } = useForm<ILoginForm>();
  const onSubmit = () => {
    console.log(getValues());
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
            <span className="font-bold text-red-500">{ errors.email?.message }</span>
          )}
          <input
            ref={register({
              required: 'Password is required',
              minLength: 10,
            })}
            name="password"
            type="password"
            placeholder="Password"
            className="input"
          />
          { errors.password?.type === 'minLength' && (
            <span className="font-bold text-red-500">비밀번호는 최소 10자 이상이어야 합니다.</span>
          )}
          { errors.password?.message && (
            <span className="font-bold text-red-500">{ errors.password?.message }</span>
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
