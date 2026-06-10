import React from 'react'
import { NavLink } from 'react-router-dom';

const VendorSidebar = () => {
  return (
    <aside className='w-64 min-h-screen bg-gray-900 text-white p-6'>
      <h1 className='text-2xl font-bold mb-8'>  BookMyVenue  </h1> 

      <ul className='space-y-4'>
        <li>
          < NavLink to="/" className={({isActive})=>
            isActive
            ?"text-indigo-400"
            :"hover:text-indigo-400"}>
              Dashboard
          </NavLink> 
        </li>  
        
        <li>
          < NavLink to="/venues" className={({isActive})=>
            isActive
            ?"text-indigo-400"
            :"hover:text-indigo-400"}>
              My Venues
          </NavLink> 
        </li>  
        
        <li>
          < NavLink to="/addvenue" className={({isActive})=>
            isActive
            ?"text-indigo-400"
            :"hover:text-indigo-400"}>
              Add Venue
          </NavLink> 
        </li>  
        
        <li>
          < NavLink to="/bookings" className={({isActive})=>
            isActive
            ?"text-indigo-400"
            :"hover:text-indigo-400"}>
              Bookings
          </NavLink> 
        </li>  
        
        <li>
          < NavLink to="/profile" className={({isActive})=>
            isActive
            ?"text-indigo-400"
            :"hover:text-indigo-400"}>
              Profile
          </NavLink> 
        </li>  
        
        <li>
          < NavLink to="/settings" className={({isActive})=>
            isActive
            ?"text-indigo-400"
            :"hover:text-indigo-400"}>
              Settings
          </NavLink> 
        </li>  

      </ul>     
    </aside>
  );
};

export default VendorSidebar
