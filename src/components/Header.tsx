import { faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useMe } from '../hooks/useMe';
import logo from '../images/logo.svg';
import { LOCALSTORAGE_TOKEN } from './../constants';

export const Header:React.FC = () => {
  const { data } = useMe();
  const isToken = Boolean(localStorage.getItem(LOCALSTORAGE_TOKEN));
  const history = useHistory();
  const logout = () => {
    if (isToken) {
      localStorage.removeItem(LOCALSTORAGE_TOKEN);
      history.push('/');
      window.location.reload();
      alert('로그아웃 되었습니다.');
    }
  }
  return (
    <>
      {!data?.me.verified && (
        <div className="bg-red-500 p-3 text-center text-xs text-white">
          <span>Please verify your email!</span>
        </div>
      )}
      <header className="py-4">
        <div className="w-full px-5 xl:px-0 max-w-screen-xl flex justify-between items-center mx-auto">
          <Link to='/'>
            <img src={logo} className="w-32" alt="nuber-eats" />
          </Link>
          <div>
            <span className="text-xs">
              <Link to='/edit-profile'>
                <FontAwesomeIcon icon={faUser} className="text-xl"/>
              </Link>
            </span>
            { isToken && (
              <button
                onClick={logout}
                className="ml-5 text-red-600 focus:outline-none"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="text-xl"/>
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  )
}