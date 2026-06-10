import {Outlet} from 'react-router-dom';
import Header from '../components/Header/Header';
import React from 'react'

function MainLayout() {
  return (
    <div>
        <Header/>
        <Outlet/>
    </div>
  )
}

export default MainLayout