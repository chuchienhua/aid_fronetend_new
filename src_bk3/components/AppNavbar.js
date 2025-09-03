import React from 'react';
import { NavLink } from 'react-router-dom';

export default function AppNavbar() {
  return (
    <nav className="navbar navbar-expand app-navbar">
      <div className="container-fluid">
        <span className="navbar-brand fw-bold">新前端 React.js</span>
        <div className="ms-auto">
          <ul className="navbar-nav">
            <li className="nav-item"><NavLink to="/models" className="nav-link" end>Models</NavLink></li>
            <li className="nav-item ms-2"><NavLink to="/scan" className="nav-link" end>Scan</NavLink></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
