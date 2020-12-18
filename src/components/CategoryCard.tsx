import React from 'react';
import { allcategories_allcategories_categories } from './../__generated__/allcategories';

interface IProps {
  category: allcategories_allcategories_categories;
  onClick: Function;
}

const CategoryCard: React.FC<IProps> = ({
  category,
  onClick,
}) => {
  const onDivClick = () => {
    onClick();
  }
  return (
    <div
      onClick={onDivClick}
      className="text-center py-3 border border-gray-300 hover:border-gray-400 transition-colors cursor-pointer"
    >
      <h1 className="pb-3 text-xl">{ category.name }</h1>
      <div
        style={{backgroundImage: `url(${category.coverImage})`}}
        className="border border-gray-200 w-16 h-16 rounded-full bg-cover group-hover:bg-gray-100 mx-auto">
      </div>
    </div>
  );
}

export default CategoryCard;