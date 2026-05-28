import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Plus, Key, Copy, Check, BookOpen, LayoutDashboard } from 'lucide-react';

export default function Dashboard() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [copied, setCopied] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      const token = localStorage.getItem('dev_token');
      const res = await fetch('http://localhost:5000/app/list', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 401 || res.status === 403) {
        handleLogout();
        return;
      }
      const data = await res.json();
      setApps(data.apps || []);
      if (!selectedApp && data.apps?.length > 0) {
        setSelectedApp(data.apps[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateApp = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('dev_token');
      const res = await fetch('http://localhost:5000/app/create', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: newAppName })
      });
      const data = await res.json();
      if (res.ok) {
        setApps([data.app, ...apps]);
        setSelectedApp(data.app);
        setShowCreate(false);
        setNewAppName('');
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('dev_token');
    navigate('/login');
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
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
            <Link to="/" style={{ color: 'var(--text-main)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 600 }}>
              <LayoutDashboard size={16} /> Dashboard
            </Link>
            <Link to="/docs" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 500 }}>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <h1 className="title">Applications</h1>
          <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => setShowCreate(!showCreate)}>
            <Plus size={16} style={{ marginRight: 8 }} />
            New Application
          </button>
        </div>

        {showCreate && (
          <div className="card" style={{ marginBottom: 32 }}>
            <h2 className="title" style={{ fontSize: 18 }}>Create New Application</h2>
            <form onSubmit={handleCreateApp} style={{ display: 'flex', gap: 16, marginTop: 16 }}>
              <input 
                className="input-field" 
                placeholder="Application Name" 
                value={newAppName}
                onChange={e => setNewAppName(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary" style={{ width: 'auto', whiteSpace: 'nowrap' }}>Create App</button>
            </form>
          </div>
        )}

        {loading ? (
          <div>Loading apps...</div>
        ) : apps.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '64px 24px' }}>
            <h3 className="title" style={{ fontSize: 18 }}>No applications yet</h3>
            <p className="subtitle">Create an application to get your API keys.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: 32 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {apps.map(app => (
                <div 
                  key={app._id}
                  onClick={() => setSelectedApp(app)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: selectedApp?._id === app._id ? 'var(--primary)' : 'transparent',
                    color: selectedApp?._id === app._id ? 'var(--bg-card)' : 'var(--text-main)',
                    fontWeight: 500,
                    transition: 'all 0.2s'
                  }}
                >
                  {app.name}
                </div>
              ))}
            </div>

            {selectedApp && (
              <div className="card">
                <h2 className="title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {selectedApp.name}
                </h2>
                
                <div style={{ marginTop: 32 }}>
                  <h3 className="input-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Key size={16} /> API Keys
                  </h3>
                  
                  <div style={{ marginTop: 16 }}>
                    <label className="input-label">Client ID (Public)</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input className="input-field" value={selectedApp.clientId} readOnly style={{ fontFamily: 'monospace' }} />
                      <button className="btn" style={{ width: 'auto', background: 'var(--bg-color)' }} onClick={() => copyToClipboard(selectedApp.clientId, 'client')}>
                        {copied === 'client' ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>

                  <div style={{ marginTop: 16 }}>
                    <label className="input-label">Client Secret (Confidential)</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input className="input-field" value={selectedApp.clientSecret} readOnly style={{ fontFamily: 'monospace' }} />
                      <button className="btn" style={{ width: 'auto', background: 'var(--bg-color)' }} onClick={() => copyToClipboard(selectedApp.clientSecret, 'secret')}>
                        {copied === 'secret' ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 32, padding: 16, background: 'var(--bg-color)', borderRadius: 8 }}>
                  <h3 className="input-label">Quick Start with React</h3>
                  <pre style={{ fontSize: 13, overflowX: 'auto', color: 'var(--text-main)', marginTop: 8 }}>
{`import { AuthenticatorProvider, AuthSignIn } from 'authenticator-react';

function App() {
  return (
    <AuthenticatorProvider 
      clientId="${selectedApp.clientId}"
      baseURL="http://localhost:5000"
    >
      <AuthSignIn />
    </AuthenticatorProvider>
  );
}`}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
