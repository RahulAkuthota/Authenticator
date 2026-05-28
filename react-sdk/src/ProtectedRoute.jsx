import React from 'react';
import { useAuth } from './AuthenticatorProvider';

export const ProtectedRoute = ({ children, fallback }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading authentication...</div>;
  }

  if (!user) {
    return fallback ? fallback : <div>Unauthorized. Please sign in.</div>;
  }

  return <>{children}</>;
};
