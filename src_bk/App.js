import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppNavbar from './components/AppNavbar.js';
import Models from './components/Models.js';
import Scan from './components/Scan.js';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-root bg-white text-dark">
        <AppNavbar />
        <main className="container-fluid py-3">
          <Routes>
            <Route path="/" element={<Navigate to="/models" replace />} />
            <Route path="/models" element={<Models />} />
            <Route path="/scan" element={<Scan />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
