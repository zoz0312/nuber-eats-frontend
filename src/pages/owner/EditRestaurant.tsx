import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

interface IParams {
  id: string;
}

const EditRestaurant: React.FC = () => {
  const { id } = useParams<IParams>();
  return (
    <></>
  )
};

export default EditRestaurant;
