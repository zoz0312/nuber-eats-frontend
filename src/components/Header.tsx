import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';
import { useMe } from '../hooks/useMe';
import logo from '../images/logo.svg';

export const Header:React.FC = () => {
  const { data } = useMe();
  return (
    <header className="py-4">
      <div className="w-full px-5 xl:px-0 max-w-screen-xl flex justify-between items-center mx-auto">
        <img src={logo} className="w-32" alt="nuber-eats" />
        <span className="text-xs">
          <Link to='/my-profile'>
            <FontAwesomeIcon icon={faUser} className="text-xl"/>
          </Link>
        </span>
      </div>
    </header>
  )
}