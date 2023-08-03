import React from 'react'
import "./style/dashboard.css";

function Navbar() {
  return (
    <nav className="navbar bg-body-tertiary animate__animated animate__bounceInDown">
        <div className="container-fluid">
            <a className="navbar-brand" href="/">HR App</a>
        </div>
    </nav>
  )
}

export default Navbar;
