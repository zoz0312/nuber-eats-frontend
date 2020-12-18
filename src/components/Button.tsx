import React from 'react';

interface IButtonProps {
  canClick: boolean;
  loading: boolean;
  actionText: string;
  className?: string;
}

const Button: React.FC<IButtonProps> = ({
  canClick,
  loading,
  actionText,
  className
}) => {
  return (
    <button
      className={`text-lg text-white py-4 transition-colors focus:outline-none ${className} ${
      canClick
        ? 'bg-lime-600 hover:bg-lime-700'
        : 'bg-gray-400 pointer-events-none'
      }`
    }>
      { loading ? 'Loadding...' : actionText }
    </button>
  )
}

export default Button;
