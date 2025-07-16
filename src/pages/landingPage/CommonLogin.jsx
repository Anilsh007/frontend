import React from 'react';
import baner from '../../assets/login.webp';
import Login from '../auth/Login';

export default function CommonLogin() {
  return (
    <>
    <div className="commonLogin">
        <div>
          <img src={baner} alt={baner} className='img-fluid' />
        </div>
        <div className="loginForm">
            <Login/>
        </div>
    </div>
    </>
  );
}