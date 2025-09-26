import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BoardPage from './pages/BoardPage';
import { Toaster } from './components/ui/toaster';
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/board" element={<BoardPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;