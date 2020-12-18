import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { CATEGORY_FRAGMENT } from '../../fragments';
import { useQuery } from '@apollo/client';
import { allcategories, allcategories_allcategories_categories } from './../../__generated__/allcategories';
import { Helmet } from 'react-helmet';
import Article from '../../components/Article';
import CategoryCard from '../../components/CategoryCard';
import CategoryModal, { IEditCategoryModalArgument } from './../../components/CategoryModal';
import { editCategory, editCategoryVariables } from './../../__generated__/editCategory';
import { fileUploader } from './../../functions/imageUploader';

const ALLCATEGORIES_QUERY = gql`
  query allcategories {
    allcategories {
      ok
      error
      categories {
        ...CategoryParts
      }
    }
  }
  ${CATEGORY_FRAGMENT}
`;

const EDIT_CATEGORY_MUTATION = gql`
  mutation editCategory($input: EditCategoryInput!) {
    editCategory(input: $input) {
      ok
      error
    }
  }
`;

const EditCategory: React.FC = () => {
  const [modalShow, setModalShow] = useState(false);
  const [modalData, setModalData] = useState<allcategories_allcategories_categories>();
  const { data, loading } = useQuery<
    allcategories
  >(ALLCATEGORIES_QUERY);

  const [editCategoryMuataion, { loading: mutationLoading }] = useMutation<
    editCategory,
    editCategoryVariables
  >(EDIT_CATEGORY_MUTATION, {
    onCompleted: (data: editCategory) => {
      const { editCategory: { ok } } = data;
      if (ok) {
        setModalShow(false);
      }
    },
    refetchQueries: [{
      query: ALLCATEGORIES_QUERY,
    }]
  });

  const modalShowData = (index: number) => {
    if (modalShow) { return; }
    setModalShow(true);
    if (data) {
      if (data.allcategories.categories) {
        setModalData(data?.allcategories.categories[index])
      }
    }
  };

  const onSubmit = async ({
    id,
    categoryName,
    file,
    coverImage,
  }: IEditCategoryModalArgument) => {
    let imageSrc = coverImage;
    try {
      if (file[0]) {
        imageSrc = await fileUploader(file[0]);
      }
      editCategoryMuataion({
        variables: {
          input: {
            categoryId: id,
            name: categoryName,
            coverImage: imageSrc,
          }
        }
      });
    } catch {
      alert('수정에 실패하였습니다.')
    }
  };

  return (
    <section>
      <Helmet>
        <title>{`Edit Category | Nuber Eats`}</title>
      </Helmet>
      <Article loading={loading}>
        <div className="grid md:grid-cols-3 gap-x-5 gap-y-10">
          { data?.allcategories.categories?.map((category, index) => (
            <CategoryCard
              key={index}
              category={category}
              onClick={() => { modalShowData(index); }}
            />
          ))}
        </div>
        { modalShow && (
          <CategoryModal
            onSubmit={onSubmit}
            modalData={modalData}
            setModalShow={setModalShow}
            mutationLoading={mutationLoading}
          />
        )}
      </Article>
    </section>
  );
}

export default EditCategory;