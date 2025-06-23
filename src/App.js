import React, { lazy, useEffect, Suspense } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { themeChange } from 'theme-change'

import ProtectedRoute from './routes/ProtectedRoute'

// Lazy-loaded pages
const Layout = lazy(() => import('./containers/Layout'))
const Login = lazy(() => import('./pages/Login'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const Register = lazy(() => import('./pages/Register'))
const Documentation = lazy(() => import('./pages/Documentation'))

function App() {
  useEffect(() => {
    themeChange(false)
  }, [])
  
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/documentation" element={<Documentation />} />
          
          <Route
            path="/app/*"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          />
          
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
