import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound = () => <>
  <div className="h-screen flex flex-col items-center justify-center">
    <h2 className="font-semibold text-lg mb-3">Page Not Found</h2>
    <h4 className="font-medium text-base mb-5">찾고있는 패이지가 없거나 이동되었습니다 {'X<'}</h4>
    <Link to='/' className="text-lime-600 hover:underline">Home으로 이동</Link>
  </div>
</>