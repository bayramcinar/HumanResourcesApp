import React from 'react'
import DashboardPanel from './dashboard'
import Sidebar from './sidebarComponent'

function MainDashboard() {
  return (
    <div>
      <Sidebar mainContent={<DashboardPanel />}/>
    </div>
  )
}

export default MainDashboard
