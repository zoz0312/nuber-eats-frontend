import { gql, useMutation, useApolloClient } from '@apollo/client';
import React from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../components/Button';
import { EMAIL_PATTERN } from '../../constants';
import { useMe } from '../../hooks/useMe';
import { editProfile, editProfileVariables } from '../../__generated__/editProfile';

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile($input: EditProfileInput!) {
    editProfile(input: $input) {
      ok
      error
    }
  }
`;
interface IFormProps {
  email?: string;
  password?: string;
}

const EditProfile = () => {
  const client = useApolloClient();
  const { data: userData, refetch: refetchUser } = useMe();
  const onCompleted = (data: editProfile) => {
    const { editProfile: { ok } } = data;
    if (ok && userData) {
      const { me: { email: prevEmail, id } } = userData;
      const { email: newEmail } = getValues();
      if (prevEmail !== newEmail) {
        refetchUser();
        // client.writeFragment({
        //   id: `User:${id}`,
        //   fragment: gql`
        //     fragment EditedUser on User {
        //       verified
        //       email
        //     }
        //   `,
        //   data: {
        //     email: newEmail,
        //     verified: true,
        //   },
        // });
      }
    }
  };

  const [editProfile, { loading }] = useMutation<
    editProfile,
    editProfileVariables
  >(EDIT_PROFILE_MUTATION, { onCompleted });

  const { register, handleSubmit, getValues, formState } = useForm<IFormProps>({
    mode: 'onChange',
    defaultValues: {
      email: userData?.me.email,
      password: '',
    }
  });

  const onSubmit = () => {
    const { email, password } = getValues();
    editProfile({
      variables: {
        input: {
          email,
          ...(password && { password }),
        }
      }
    })
  }

  return (
    <div className="mt-52 flex flex-col justify-center items-center">
      <h4 className="font-semibold text-2xl mb-3">Edit Profile</h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-screen-sm grid gap-5 my-5 px-5 w-full"
      >
        <input
          ref={register({
            pattern: EMAIL_PATTERN,
          })}
          name="email"
          className="input"
          type="email"
          placeholder="Email"
          required
        />
        <input
          ref={register}
          name="password"
          className="input"
          type="password"
          placeholder="Password"
        />
        <Button
          loading={loading}
          canClick={formState.isValid}
          actionText={`Update Profile`}
        />
      </form>
    </div>
  );
}

export default EditProfile;
