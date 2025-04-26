import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./Components/Login"
import Register from "./Components/Register";
import Home from './Components/Home';
import ProtectedRoute from './Components/ProtectedRoute';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} /> {/* the element we want to pass and the < .. /> is a tag*/}
        <Route path="/register" element={<Register />} />
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
