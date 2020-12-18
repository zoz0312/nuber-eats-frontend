import React from 'react';
import { useForm } from 'react-hook-form';
import Button from './Button';
import { allcategories_allcategories_categories } from './../__generated__/allcategories';

interface IProps {
  modalData: allcategories_allcategories_categories | undefined;
  setModalShow: Function;
  onSubmit: (object: IEditCategoryModalArgument) => void;
  mutationLoading: boolean;
};

interface IEditCategoryModalProps {
  categoryName: string;
  file: FileList;
};

export interface IEditCategoryModalArgument extends IEditCategoryModalProps {
  id: number;
  coverImage: string | null;
}

const CategoryModal: React.FC<IProps> = ({
  modalData,
  setModalShow,
  onSubmit,
  mutationLoading,
}) => {
  const {
    register,
    getValues,
    formState,
    handleSubmit,
  } = useForm<IEditCategoryModalProps>({
    mode: 'onChange',
    defaultValues: {
      categoryName: modalData?.name,
    }
  });

  const formSubmit = () => {
    if (mutationLoading) { return; }
    if (!modalData) { return; }
    onSubmit({
      ...getValues(),
      id: modalData.id,
      coverImage: modalData.coverImage,
    });
  }

  return (
    <div className="absolute w-screen h-screen top-0 left-0 z-10 flex items-center justify-center">
      <div className="absolute w-4/6 bg-white z-50 rounded-2xl shadow-xl max-w-xl">
        <header className="flex justify-end">
          <button
            className="text-xl font-bold p-3 text-white focus:outline-none bg-red-400 rounded-tr-2xl hover:bg-red-500 transition-colors"
            onClick={() => { setModalShow(false) }}
          >X</button>
        </header>
        <article className="px-5">
          <h1 className="text-center text-2xl">Edit Category</h1>
          <form
            onSubmit={handleSubmit(formSubmit)}
            className="py-5"
          >
            <div
              style={{backgroundImage: `url(${modalData?.coverImage})`}}
              className="mb-5 border border-gray-200 w-32 h-32 rounded-full bg-cover group-hover:bg-gray-100 mx-auto">
            </div>
            <div className="mb-5">
              <input
                ref={register}
                type="file"
                name="file"
                accept="image/*"
              />
            </div>
            <input
              ref={register({required: 'Category Name is required.'})}
              type="text"
              className="input w-full mb-5"
              placeholder="Category Name"
              name="categoryName"
              required
            />
            <Button
              className="w-full mt-5"
              canClick={formState.isValid}
              loading={mutationLoading}
              actionText={`카테고리 수정하기`}
            />
          </form>
        </article>
      </div>
      <div onClick={() => { setModalShow(false) }} className="absolute bg-black w-screen h-screen top-0 opacity-30 z-10"></div>
    </div>
  );
}

export default CategoryModal;
