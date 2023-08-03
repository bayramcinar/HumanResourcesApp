import React from 'react'
import Employees from './employees'
import Sidebar from './sidebarComponent'

function MainEmployees() {
  return (
      <Sidebar mainContent={<Employees />}/>
  )
}

export default MainEmployees
