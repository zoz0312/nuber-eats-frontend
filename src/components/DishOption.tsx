import React from 'react';
import { restaurant_restaurant_restaurant_menu_options_choices } from '../__generated__/restaurant';

interface IDishOptionProps {
  id: number;
  isSelected: boolean;
  onClick: Function | null;
  name: string;
  extra?: number | null;
  choices?: restaurant_restaurant_restaurant_menu_options_choices[] | null;
  choiceItemHandle: Function;
  isChoiceSelected: Function;
};

const DishOption: React.FC<IDishOptionProps> = ({
  id,
  isSelected,
  onClick,
  name,
  extra,
  choices = [],
  choiceItemHandle,
  isChoiceSelected,
}) => {
  const optionClick = () => {
    if (onClick) {
      onClick();
    }
  }
  return (
    <div>
      <div
        className={`py-1 px-2 mt-2 border-2 transition-colors
          ${isSelected ? 'border-lime-500' : 'border-gray-300'}
        `}
        onClick={optionClick}
      >
        <div className="flex items-center justify-items-center">
          <h6 className="font-medium mr-1 text-lg">{name}</h6>
          { extra && <h6 className="mr-2">(${extra})</h6> }
        </div>
      </div>
      {choices !== null &&
        <div className="flex items-right flex-col mt-1 ml-5">
          {choices?.map((choice, choiceIndex) => (
            <div
              key={choiceIndex}
              className={`flex mb-1 px-2 py-1 border-2 transition-colors ${isChoiceSelected(id, name, choice) ? 'border-lime-500' : 'border-gray-300'}`}
              onClick={() => {
                choiceItemHandle(id, name, choice)
              }}
            >
              <h6 className="mr-1" style={{fontSize: `1rem`}}>{choice.name}</h6>
              <h6 className="mr-2">(${choice.extra})</h6>
            </div>
          ))}
        </div>
      }
  </div>
  )
};

export default DishOption;
