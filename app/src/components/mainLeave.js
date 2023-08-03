import React from 'react'
import Sidebar from './sidebarComponent'
import EmployeeLeaves from './employeeLeaves';

function MainLeave() {
  return (
      <Sidebar mainContent={<EmployeeLeaves />}/>
  )
}

export default MainLeave;