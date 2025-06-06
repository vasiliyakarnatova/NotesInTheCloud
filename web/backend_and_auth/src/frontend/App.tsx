import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';import ProtectedRoute from './auth/pages/ProtectedRoute';

import PublicRoute from './auth/pages/PublicRoute';
import Login from './auth/pages/Login';
import Register from './auth/pages/Register';
import Home from './auth/pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />    
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />

        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />

        <Route path="/home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App
