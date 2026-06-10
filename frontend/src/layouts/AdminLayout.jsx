import {Outlet} from 'react-router-dom';
import Header from '../components/Header/Header';
import React from 'react'

function AdminLayout() {
  return (
    <div>
        <Header/>
        <Outlet/>
    </div>
  )
}

export default AdminLayout