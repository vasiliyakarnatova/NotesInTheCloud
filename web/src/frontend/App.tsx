import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';import ProtectedRoute from './auth/pages/ProtectedRoute';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './main/lib/queryClient';
import { TooltipProvider } from "./main/components/ui/tooltip";
import { Toaster } from "./main/components/ui/toaster";

import Home from './main/pages/Home';
import NotFound from './main/pages/not-found';

import PublicRoute from './auth/pages/PublicRoute';
import Login from './auth/pages/Login';
import Register from './auth/pages/Register';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
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

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App
