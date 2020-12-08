import React from 'react';
import { Link } from 'react-router-dom';

interface IRestaurantProps {
  id: number;
  coverImage: string;
  name: string;
  categoryName?: string;
};

const Restaurant: React.FC<IRestaurantProps> = ({
  id,
  coverImage,
  name,
  categoryName,
}) => {
  return (
    <Link to={`/restaurant/${id}`}>
      <div>
        <div
          style={{backgroundImage:`url(${coverImage})`}}
          className="bg-red-500 py-28 bg-cover bg-center mb-3"
        ></div>
        <h3 className="border-b border-gray-200 text-xl font-semibold pt-1 pb-3 mb-2">{ name }</h3>
        <span className="font-light text-sm opacity-80 text-gray-500">{ categoryName }</span>
      </div>
    </Link>
  );
}

export default Restaurant;
