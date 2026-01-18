import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import axios from 'axios'

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null)

  useEffect(() => {
    let mounted = true
    axios.get('http://localhost:3000/api/auth/verify', { withCredentials: true })
      .then(() => { if (mounted) setIsAuth(true) })
      .catch(() => { if (mounted) setIsAuth(false) })
    return () => { mounted = false }
  }, [])

  if (isAuth === null) return <div>Loading...</div>
  return isAuth ? children : <Navigate to="/login" replace />
}

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes