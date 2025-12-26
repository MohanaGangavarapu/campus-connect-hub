// Landing page that redirects to login or dashboard
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect based on auth status
    if (isAuthenticated) {
      navigate(isAdmin ? '/admin' : '/student');
    } else {
      navigate('/login');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Show nothing while redirecting
  return null;
};

export default Index;
