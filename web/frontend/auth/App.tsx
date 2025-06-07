import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './src/pages/ProtectedRoute';

import PublicRoute from './src/pages/PublicRoute';
import Login from './src/pages/Login';
import Register from './src/pages/Register';
import Home from './src/pages/Home';

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
