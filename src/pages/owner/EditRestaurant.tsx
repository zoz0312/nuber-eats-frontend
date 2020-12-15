import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMyRestaurant } from '../../hooks/useMyRestaurant';

interface IParams {
  id: string;
}

const EditRestaurant: React.FC = () => {
  const { id } = useParams<IParams>();
  const { data, loading } = useMyRestaurant(+id);
  return (
    <></>
  )
};

export default EditRestaurant;
