import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, BookOpen, LayoutDashboard } from 'lucide-react';

export default function Docs() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('dev_token');
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">
      <nav className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: 24, height: 24, background: 'var(--primary)', borderRadius: 4 }}></div>
            <span style={{ fontWeight: 600, fontSize: '18px' }}>Authenticator</span>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 500 }}>
              <LayoutDashboard size={16} /> Dashboard
            </Link>
            <Link to="/docs" style={{ color: 'var(--text-main)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 600 }}>
              <BookOpen size={16} /> Documentation
            </Link>
          </div>
        </div>
        <button className="btn" style={{ background: 'transparent', color: 'var(--text-muted)' }} onClick={handleLogout}>
          <LogOut size={16} style={{ marginRight: 8 }} />
          Sign Out
        </button>
      </nav>

      <main className="dashboard-content">
        <h1 className="title" style={{ marginBottom: '8px' }}>Documentation</h1>
        <p className="subtitle">Learn how to integrate Authenticator into your application.</p>
        
        <div className="card" style={{ marginTop: '24px' }}>
          <h2 className="title" style={{ fontSize: '20px', marginBottom: '16px' }}>1. Installation</h2>
          <p style={{ marginBottom: '16px', color: 'var(--text-muted)' }}>Install our SDKs via npm to get started quickly.</p>
          <pre style={{ padding: '16px', background: 'var(--bg-color)', borderRadius: '8px', fontSize: '14px', overflowX: 'auto', marginBottom: '32px' }}>
            <code>npm install authenticator-react authenticator-sdk</code>
          </pre>

          <h2 className="title" style={{ fontSize: '20px', marginBottom: '16px' }}>2. Setup Provider</h2>
          <p style={{ marginBottom: '16px', color: 'var(--text-muted)' }}>Wrap your application in the <strong>AuthenticatorProvider</strong> to provide authentication context to all components.</p>
          <pre style={{ padding: '16px', background: 'var(--bg-color)', borderRadius: '8px', fontSize: '14px', overflowX: 'auto', marginBottom: '32px' }}>
            <code>
{`import { AuthenticatorProvider } from 'authenticator-react';

function App() {
  return (
    <AuthenticatorProvider 
      clientId="YOUR_CLIENT_ID"
      baseURL="https://your-backend-url.com"
    >
      <YourApp />
    </AuthenticatorProvider>
  );
}`}
            </code>
          </pre>

          <h2 className="title" style={{ fontSize: '20px', marginBottom: '16px' }}>3. UI Components</h2>
          <p style={{ marginBottom: '16px', color: 'var(--text-muted)' }}>We provide fully-styled, plug-and-play components for sign in, sign up, and user management.</p>
          
          <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>AuthSignIn & AuthSignUp</h3>
          <p style={{ marginBottom: '12px', fontSize: '14px', color: 'var(--text-muted)' }}>Use these components to render complete authentication forms.</p>
          <pre style={{ padding: '16px', background: 'var(--bg-color)', borderRadius: '8px', fontSize: '14px', overflowX: 'auto', marginBottom: '24px' }}>
            <code>
{`import { AuthSignIn, AuthSignUp } from 'authenticator-react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  return <AuthSignIn onSignedIn={() => navigate('/dashboard')} />;
}

function SignupPage() {
  const navigate = useNavigate();
  return <AuthSignUp onSignedUp={() => navigate('/dashboard')} />;
}`}
            </code>
          </pre>

          <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>UserButton</h3>
          <p style={{ marginBottom: '12px', fontSize: '14px', color: 'var(--text-muted)' }}>The UserButton renders a dropdown avatar. It handles logout automatically.</p>
          <pre style={{ padding: '16px', background: 'var(--bg-color)', borderRadius: '8px', fontSize: '14px', overflowX: 'auto', marginBottom: '32px' }}>
            <code>
{`import { UserButton } from 'authenticator-react';

function Navbar() {
  return (
    <nav>
      <Logo />
      <UserButton />
    </nav>
  );
}`}
            </code>
          </pre>

          <h2 className="title" style={{ fontSize: '20px', marginBottom: '16px' }}>4. Protecting Routes</h2>
          <p style={{ marginBottom: '16px', color: 'var(--text-muted)' }}>Use the <strong>ProtectedRoute</strong> component to prevent unauthorized users from accessing certain pages.</p>
          <pre style={{ padding: '16px', background: 'var(--bg-color)', borderRadius: '8px', fontSize: '14px', overflowX: 'auto', marginBottom: '32px' }}>
            <code>
{`import { ProtectedRoute } from 'authenticator-react';

function Dashboard() {
  return (
    <ProtectedRoute fallback={<div>Please log in</div>}>
      <h1>Protected Dashboard</h1>
    </ProtectedRoute>
  );
}`}
            </code>
          </pre>

          <h2 className="title" style={{ fontSize: '20px', marginBottom: '16px' }}>5. Custom Hooks</h2>
          <p style={{ marginBottom: '16px', color: 'var(--text-muted)' }}>If you need to build custom UI or read the current user's state, use the <strong>useAuth</strong> hook.</p>
          <pre style={{ padding: '16px', background: 'var(--bg-color)', borderRadius: '8px', fontSize: '14px', overflowX: 'auto', marginBottom: '16px' }}>
            <code>
{`import { useAuth } from 'authenticator-react';

function CustomWelcome() {
  const { user, loading, auth } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please sign in</div>;

  return <div>Welcome back, {user.email}!</div>;
}`}
            </code>
          </pre>
        </div>
      </main>
    </div>
  );
}
