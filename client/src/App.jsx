import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Properties from './pages/Properties';
import DashboardLayout from './pages/DashboardLayout';
import MyListings from './pages/MyListings';
import ProfileSettings from './pages/ProfileSettings';

export default function App() {
  return (
    <ChakraProvider value={defaultSystem}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/properties" element={<Properties />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="listings" replace />} />
            <Route path="listings" element={<MyListings />} />
            <Route path="profile" element={<ProfileSettings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}
