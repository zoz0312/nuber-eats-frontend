import React from 'react';

interface IFormErrorProps {
  errorMessage: string;
}

const FormError: React.FC<IFormErrorProps> = ({ errorMessage }) => {
  return (
    <span role="alert" className="font-bold text-red-500">{ errorMessage }</span>
  )
}

export default FormError;
