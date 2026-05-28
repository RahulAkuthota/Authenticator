import React from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthenticatorProvider, AuthSignIn, AuthSignUp, UserButton, ProtectedRoute } from 'authenticator-react';

const CLIENT_ID = 'auth_6f58204cd1c52b535359196bbf029e08'; // Replace with a real one after creating an app in the dashboard if needed, or we just mock one for demo if the backend is running.
// The user should paste their own clientId here.

function Home() {
  return (
    <div className="demo-content">
      <div className="demo-card">
        <h2>Welcome to the Demo App!</h2>
        <p>This application is protected by Authenticator.</p>
        <div style={{ marginTop: 24, display: 'flex', gap: 16 }}>
          <Link to="/login" style={{ padding: '8px 16px', background: 'black', color: 'white', textDecoration: 'none', borderRadius: 6 }}>Sign In</Link>
          <Link to="/signup" style={{ padding: '8px 16px', border: '1px solid black', color: 'black', textDecoration: 'none', borderRadius: 6 }}>Sign Up</Link>
          <Link to="/dashboard" style={{ padding: '8px 16px', background: '#f0f0f0', color: 'black', textDecoration: 'none', borderRadius: 6 }}>Go to Protected Dashboard</Link>
        </div>
      </div>
    </div>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  return (
    <div className="demo-content" style={{ display: 'flex', justifyContent: 'center' }}>
      <AuthSignIn onSignedIn={() => navigate('/dashboard')} />
    </div>
  );
}

function SignupPage() {
  const navigate = useNavigate();
  return (
    <div className="demo-content" style={{ display: 'flex', justifyContent: 'center' }}>
      <AuthSignUp onSignedUp={() => navigate('/dashboard')} />
    </div>
  );
}

function DashboardPage() {
  return (
    <ProtectedRoute fallback={<div className="demo-content">You must be logged in to view this page.</div>}>
      <div className="demo-content">
        <div className="demo-card">
          <h2>Protected Dashboard</h2>
          <p>This is a protected route. Only authenticated users can see this.</p>
        </div>
      </div>
    </ProtectedRoute>
  );
}

function Layout() {
  const navigate = useNavigate();
  return (
    <div>
      <nav className="demo-nav">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h1>Demo App</h1>
        </Link>
        <UserButton onSignedOut={() => navigate('/')} />
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      {/* 
        In a real scenario, you'd fetch the clientId from environment variables.
        We provide a placeholder here. The developer copies it from their dashboard.
      */}
      <AuthenticatorProvider clientId={CLIENT_ID} baseURL="http://localhost:5000">
        <Layout />
      </AuthenticatorProvider>
    </BrowserRouter>
  );
}
