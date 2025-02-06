import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import Chat from './pages/Chat';
import Navbar from './components/Navbar';

function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <ChakraProvider>
      <BrowserRouter>
        <Box minH="100vh">
          {isAuthenticated && <Navbar />}
          <Routes>
            <Route 
              path="/login" 
              element={!isAuthenticated ? <Login /> : <Navigate to="/" />} 
            />
            <Route 
              path="/admin/*" 
              element={
                isAuthenticated && ['Owner', 'Admin', 'Moderator'].includes(user?.role) 
                  ? <AdminPanel /> 
                  : <Navigate to="/" />
              } 
            />
            <Route 
              path="/" 
              element={isAuthenticated ? <Chat /> : <Navigate to="/login" />} 
            />
          </Routes>
        </Box>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
