import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./Components/Login"
import Register from "./Components/Register";
import Home from './Components/Home';
import ProtectedRoute from './Components/ProtectedRoute';
import PublicRoute from './Components/PublicRoute';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

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
  )

}

export default App
