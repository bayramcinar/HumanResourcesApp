import React from 'react'
import Companies from './companies'
import Sidebar from './sidebarComponent'

function MainCompanies() {
  return (
    <div>
      <Sidebar mainContent={<Companies />}/>
    </div>
  )
}

export default MainCompanies
