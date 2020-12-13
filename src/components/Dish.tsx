import React from 'react';
import { restaurant_restaurant_restaurant_menu_options } from './../__generated__/restaurant';

interface IDishProps {
  menu: {
    id: number;
    name: string;
    price: number;
    photo: string | null;
    description: string;
    options: restaurant_restaurant_restaurant_menu_options[] | null;
  };
  isCustomer?: boolean;
}

const Dish: React.FC<IDishProps> = ({
  menu,
  isCustomer = false,
}) => {
  console.log('menu.options', menu.options)
  return (
    <div
      className="flex flex-row justify-between border-2 border-gray-300 hover:border-gray-500 transition-colors cursor-pointer"
    >
      <div className="flex flex-col justify-top p-3">
        {isCustomer ? (
          <>
            <div>
              <span className="text-xl">{ menu.name }</span>
            </div>
            <span className="text-2xl font-medium">{ `$${menu.price}` }</span>
            { menu.options !== null && (
              <div className="text-gray-600 text-xs mt-2">
                <h5 className="my-3 font-medium">Dish Options</h5>
                {menu.options?.map((option, index) => (
                  <>
                    <div key={index} className="flex items-end justify-items-center mt-2">
                      <h6 className="font-medium mr-1 text-black text-lg">{option.name}</h6>
                      <h6 className="mr-2">(${option.extra})</h6>
                    </div>
                    {option.choices !== null &&
                      <div className="flex items-center flex-col mt-1 ml-2">
                        {option.choices?.map(choice => (
                          <div className="flex">
                            <h6 className="mr-1" style={{fontSize: `1rem`}}>{choice.name}</h6>
                            <h6 className="mr-2">(${choice.extra})</h6>
                          </div>
                        ))}
                      </div>
                    }
                  </>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div>
              <span className="text-xl">{ menu.name }</span>
              <div className="text-gray-600 text-xs mt-2">
                {menu.options?.map((option, index) => (
                  <span key={index}>{ `${(index === 0 ? '':', ')} ${option.name}` }</span>
                ))}
              </div>
            </div>
            <span className="text-2xl font-medium">{ `$${menu.price}` }</span>
          </>
        )}
      </div>
      <div className="h-full border-l-2 border-gray-300">
        <div
          style={{backgroundImage: `url(${menu.photo})`}}
          className="bg-white w-32 h-32 p-3"
        ></div>
      </div>
    </div>
  );
}

export default Dish;