import React from 'react';
import { isLoggedInVar } from '../apollo';
import { useForm } from 'react-hook-form';

const LoggedOutRouter = () => {
  const { register, watch, handleSubmit, errors } = useForm();

  const onSubmit = () => {
    console.log(watch());
  }

  const onInvalid = (data: any) => {
    console.log('data', data)
    console.log(`can't create`);
  }

  console.log('errors', errors)

  return (
    <div>
      <span>LoggedOutRouter</span>
      <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <div>
          <input
            ref={register({
              required: true,
              validate: (email: string) => email.includes('@gmail.com'),
            })}
            type="email"
            name="email"
            required
            placeholder="email"
          />
        </div>
        <div>
          <input
            ref={register({
              required: true,
            })}
            type="password"
            name="password"
            required
            placeholder="password"
          />
        </div>
        <button>Click to login</button>
      </form>
    </div>
  )
}

export default LoggedOutRouter;
