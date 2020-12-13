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
  orderStarted?: boolean;
  orderItemHandle?: (dishId: number) => void;
  optionItemHandle?: (dishId: number, option: any) => void;
  isSelected?: boolean;
}

const Dish: React.FC<IDishProps> = ({
  menu,
  isCustomer = false,
  orderStarted = false,
  orderItemHandle,
  optionItemHandle,
  isSelected = false,
}) => {

  const onClick = () => {
    if (isCustomer && orderStarted && orderItemHandle) {
      orderItemHandle(menu.id);
    }
  };

  const onOptionClick = () => {
    if (optionItemHandle) {

    }
  };

  return (
    <div
      className={`flex flex-row justify-between border-2 transition-colors cursor-pointer ${
        isSelected ?
        'border-lime-600 hover:border-lime-700 ' :
        'border-gray-300 hover:border-gray-500 '
      }`}
    >
      <div className="flex flex-col justify-top p-3">
        {isCustomer ? (
          <>
            <div>
              <span className="text-xl">
                { menu.name }
                { orderStarted && (
                  <button
                    type="button"
                    className={`ml-2 transition-colors p-2 focus:outline-none text-sm ${isSelected ? 'bg-gray-300' : 'bg-lime-500'}`}
                    onClick={onClick}
                  >{ isSelected ? '해제' : '선택' }</button>
                )}
              </span>
            </div>
            <span className="text-2xl font-medium">{ `$${menu.price}` }</span>
            { menu.options !== null && (
              <div className="text-gray-600 text-xs mt-2">
                <h5 className="my-3 font-medium">Dish Options</h5>
                {menu.options?.map((option, index) => (
                  <div
                    key={index}
                    onClick={
                      () => optionItemHandle ?
                        optionItemHandle(menu.id, {
                          name: option.name,
                          extra: option.extra,
                        }) : null
                    }
                  >
                    <div key={index} className="flex items-end justify-items-center mt-2">
                      <h6 className="font-medium mr-1 text-black text-lg">{option.name}</h6>
                      <h6 className="mr-2">(${option.extra})</h6>
                    </div>
                    {option.choices !== null &&
                      <div className="flex items-center flex-col mt-1 ml-2">
                        {option.choices?.map((choice, choiceIndex) => (
                          <div key={choiceIndex} className="flex">
                            <h6 className="mr-1" style={{fontSize: `1rem`}}>{choice.name}</h6>
                            <h6 className="mr-2">(${choice.extra})</h6>
                          </div>
                        ))}
                      </div>
                    }
                  </div>
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