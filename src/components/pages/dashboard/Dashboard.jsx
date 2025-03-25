import React from 'react'
import { useSelector } from 'react-redux';
import ClientDashboard from './ClientDashboard';
import AdminDashboard from './AdminDashboard';


function Dashboard() {
  const userData = useSelector(state => state.user.userData);

  return (
    <>
      {userData.roles.indexOf('Client') !== -1 ?
        <ClientDashboard />
        :
        <AdminDashboard />
      }
    </>
  )
}

export default Dashboard