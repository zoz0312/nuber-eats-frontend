import React from 'react';

interface IDishProps {
  menu: {
    id: number;
    name: string;
    price: number;
    photo: string | null;
    description: string;
    options: {
      name: string;
    }[] | null;
  }
}

const Dish: React.FC<IDishProps> = ({ menu }) => {
  return (
    <div
      className="flex flex-row justify-between border-2 border-gray-300 hover:border-gray-500 transition-colors cursor-pointer"
    >
      <div className="flex flex-col justify-between p-3">
        <div>
          <span className="text-xl">{ menu.name }</span>
          <div className="text-gray-600 text-xs mt-2">
            {menu.options?.map((option, index) => (
              <span key={index}>{ `${(index === 0 ? '':', ')} ${option.name}` }</span>
            ))}
          </div>
        </div>
        <span className="text-2xl font-medium">{ `$${menu.price}` }</span>
      </div>
      <div
        style={{backgroundImage: `url(${menu.photo})`}}
        className="bg-white w-32 h-32 p-3 border-l-2 border-gray-300"
      ></div>
    </div>
  );
}

export default Dish;