import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from './Button';

export interface IDishFormProps {
  name: string;
  price: string;
  description: string;
  file: any;
  [key: string]: string;
};

export interface IDishFormChoices {
  optionId: number;
  id: number;
};

interface IProps {
  onSubmit: (
    object: IDishFormProps,
    options: number[],
    choices: IDishFormChoices[],
  ) => void;
  loading: boolean;
  defaultValues?: IDishFormProps;
  buttonText: string;
}

const DishForm: React.FC<IProps> = ({
  onSubmit,
  loading,
  defaultValues,
  buttonText,
  children,
}) => {
  const [options, setOptions] = useState<number[]>([]);
  const [choices, setChoices] = useState<IDishFormChoices[]>([]);

  const {
    register,
    getValues,
    formState,
    handleSubmit,
    setValue,
  } = useForm<IDishFormProps>({
    mode: 'onChange',
    defaultValues,
  });

  const formSubmit = () => {
    if (loading) { return };
    onSubmit(getValues(), options, choices);
  }

  const onAddOptionClick = () => {
    setOptions(current => [...current, Date.now()]);
  };

  const onAddChoiceClick = (optionId: number) => {
    setChoices(current => [...current, { optionId, id: Date.now() }]);
  }
  const onDeleteOptionClick = (idToDelete: number) => {
    setOptions(current => current.filter(id => id !== idToDelete));

    setValue(`optionName-${idToDelete}`, '');
    setValue(`optionExtra-${idToDelete}`, '0');
  };

  const onDeleteChoiceClick = (optionId: number, choiceId: number) => {
    setChoices(current => current.filter(choice => {
      return choice.id !== choiceId
    }));

    setValue(`choiceName-${optionId}-${choiceId}`, '');
    setValue(`choiceExtra-${optionId}-${choiceId}`, '0');
  }

  return (
    <form
      onSubmit={handleSubmit(formSubmit)}
      className="grid gap-5 my-5 px-5 w-full max-w-screen-sm mx-auto"
    >
      <input
        ref={register({required: 'name is required.'})}
        className="input"
        name="name"
        minLength={2}
        placeholder="Name"
        type="text"
        required
      />
      <input
        ref={register({required: 'price is required.'})}
        className="input"
        name="price"
        min={0}
        placeholder="Price"
        type="number"
        required
      />
      <input
        ref={register({required: 'description is required.'})}
        className="input"
        name="description"
        minLength={2}
        placeholder="Description"
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
      <div
        className="flex flex-col items-start"
      >
        {options.length !== 0 &&
          options.map((id) => (
          <div key={id}>
            <div
              className="mt-5 flex flex-row justify-center items-center"
            >
              <input
                ref={register({required: true})}
                name={`optionName-${id}`}
                type="text"
                placeholder="Option Name"
                className="mr-2 input-sm"
              />
              <input
                ref={register({required: true})}
                name={`optionExtra-${id}`}
                type="number"
                min={0}
                placeholder="Option Extra"
                defaultValue={0}
                className="mr-2 input-sm"
              />
              <div className="inline-block">
                <button
                  type="button"
                  name="add-dish-btn"
                  onClick={() => onAddChoiceClick(id)}
                  className="cursor-pointer text-white bg-lime-600 py-1 px-2 hover:bg-lime-700 transition-colors"
                >Add Dish Choice</button>
                <button
                  type="button"
                  name="delete-option-btn"
                  className="bg-red-500 text-white w-8 h-8 font-bold hover:bg-red-700 transition-colors"
                  onClick={() => onDeleteOptionClick(id)}
                >X</button>
              </div>
            </div>
              {choices.length !== 0 &&(
                choices.filter(chioce => chioce.optionId === id).map(choiceId => (
                  <div
                    key={choiceId.id}
                    className="mt-2 ml-10 flex flex-row items-center"
                  >
                    <input
                      ref={register({required: true})}
                      name={`choiceName-${id}-${choiceId.id}`}
                      type="text"
                      placeholder="Choice Name"
                      minLength={2}
                      className="mr-2  input-sm"
                    />
                    <input
                      ref={register({required: true})}
                      name={`choiceExtra-${id}-${choiceId.id}`}
                      type="number"
                      placeholder="Choice Extra"
                      defaultValue={0}
                      min={0}
                      className="mr-2 input-sm"
                    />
                    <button
                      type="button"
                      name="delete-choice-btn"
                      className="bg-red-500 text-white w-8 h-8 font-bold hover:bg-red-700 transition-colors"
                      onClick={() => onDeleteChoiceClick(id, choiceId.id)}
                    >X</button>
                  </div>
                ))
              )}
          </div>))
        }
      </div>
      <div className="text-center">
        <button
          type="button"
          onClick={onAddOptionClick}
          className="text-white py-1 px-2 w-1/3 text-center bg-lime-600 hover:bg-lime-700 transition-colors"
        >옵션 추가하기</button>
      </div>
      <Button
        canClick={formState.isValid}
        loading={loading}
        actionText={buttonText}
      />
    </form>
  );
};

export default DishForm;
