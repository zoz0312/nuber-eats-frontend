import React from 'react';
import { useForm } from 'react-hook-form';
import Button from './Button';

export interface IRestaurantFormProps {
  name: string;
  address: string;
  categoryName: string;
  file: FileList;
};

interface IProps {
  onSubmit: (object: IRestaurantFormProps) => void;
  loading: boolean;
}

const RestaurantForm: React.FC<IProps> = ({
  onSubmit,
  loading,
  children
}) => {
  const {
    register,
    getValues,
    formState,
    handleSubmit
  } = useForm<IRestaurantFormProps>({
    mode: 'onChange',
  });

  const formSubmit = () => {
    if (loading) { return };
    onSubmit(getValues());
  }

  return (
    <form
      onSubmit={handleSubmit(formSubmit)}
      className="grid gap-5 my-5 px-5 w-full"
    >
      <input
        ref={register({required: 'Name is required.'})}
        className="input"
        name="name"
        placeholder="Name"
        type="text"
        required
      />
      <input
        ref={register({required: 'Address is required.'})}
        className="input"
        name="address"
        placeholder="Address"
        type="text"
        required
      />
      <input
        ref={register({required: 'Category Name is required.'})}
        className="input"
        name="categoryName"
        placeholder="Category Name"
        type="text"
        required
      />
      <div>
        <input
          type="file"
          name="file"
          accept="image/*"
          ref={register}
        />
      </div>
      <Button
        loading={loading}
        canClick={formState.isValid}
        actionText={'Create Restaurant'}
      />
      { children }
    </form>
  );
};

export default RestaurantForm;