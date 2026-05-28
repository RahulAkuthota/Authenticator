import Authenticator from './Authenticator.js';

// Base style for our components
const styles = `
  <style>
    :host {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      --auth-primary: #000000;
      --auth-primary-hover: #333333;
      --auth-bg: #ffffff;
      --auth-border: #eaeaec;
      --auth-text: #1a1a1a;
      --auth-text-muted: #666666;
      --auth-radius: 8px;
    }
    .auth-card {
      background: var(--auth-bg);
      border: 1px solid var(--auth-border);
      border-radius: var(--auth-radius);
      padding: 32px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      width: 100%;
      max-width: 400px;
      box-sizing: border-box;
      margin: 0 auto;
    }
    .auth-title {
      font-size: 20px;
      font-weight: 600;
      color: var(--auth-text);
      margin: 0 0 8px 0;
    }
    .auth-subtitle {
      font-size: 14px;
      color: var(--auth-text-muted);
      margin: 0 0 24px 0;
    }
    .auth-form-group {
      margin-bottom: 16px;
    }
    .auth-label {
      display: block;
      font-size: 13px;
      font-weight: 500;
      color: var(--auth-text);
      margin-bottom: 6px;
    }
    .auth-input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid var(--auth-border);
      border-radius: 6px;
      font-size: 14px;
      box-sizing: border-box;
      outline: none;
      transition: border-color 0.2s;
    }
    .auth-input:focus {
      border-color: var(--auth-primary);
    }
    .auth-btn {
      width: 100%;
      padding: 10px;
      background: var(--auth-primary);
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    }
    .auth-btn:hover {
      background: var(--auth-primary-hover);
    }
    .auth-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    .auth-error {
      color: #e53e3e;
      font-size: 13px;
      margin-bottom: 16px;
      display: none;
    }
  </style>
`;

class AuthSignIn extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.shadowRoot.querySelector('form').addEventListener('submit', this.handleSubmit.bind(this));
  }

  async handleSubmit(e) {
    e.preventDefault();
    const email = this.shadowRoot.querySelector('#email').value;
    const password = this.shadowRoot.querySelector('#password').value;
    const btn = this.shadowRoot.querySelector('.auth-btn');
    const errEl = this.shadowRoot.querySelector('.auth-error');
    
    btn.disabled = true;
    btn.textContent = 'Signing in...';
    errEl.style.display = 'none';

    try {
      if (!window.__authenticator) throw new Error('Authenticator not initialized on window.__authenticator');
      await window.__authenticator.login(email, password);
      this.dispatchEvent(new CustomEvent('signedin', { bubbles: true, composed: true }));
      // Optional redirect handled by consumer
    } catch (err) {
      errEl.textContent = err.message || 'Failed to sign in';
      errEl.style.display = 'block';
    } finally {
      btn.disabled = false;
      btn.textContent = 'Sign In';
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      ${styles}
      <div class="auth-card">
        <h2 class="auth-title">Sign In</h2>
        <p class="auth-subtitle">Welcome back! Please enter your details.</p>
        <div class="auth-error"></div>
        <form>
          <div class="auth-form-group">
            <label class="auth-label" for="email">Email address</label>
            <input type="email" id="email" class="auth-input" required />
          </div>
          <div class="auth-form-group">
            <label class="auth-label" for="password">Password</label>
            <input type="password" id="password" class="auth-input" required />
          </div>
          <button type="submit" class="auth-btn">Sign In</button>
        </form>
      </div>
    `;
  }
}

class AuthSignUp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.shadowRoot.querySelector('form').addEventListener('submit', this.handleSubmit.bind(this));
  }

  async handleSubmit(e) {
    e.preventDefault();
    const email = this.shadowRoot.querySelector('#email').value;
    const password = this.shadowRoot.querySelector('#password').value;
    const btn = this.shadowRoot.querySelector('.auth-btn');
    const errEl = this.shadowRoot.querySelector('.auth-error');
    
    btn.disabled = true;
    btn.textContent = 'Creating account...';
    errEl.style.display = 'none';

    try {
      if (!window.__authenticator) throw new Error('Authenticator not initialized on window.__authenticator');
      await window.__authenticator.signup(email, password);
      this.dispatchEvent(new CustomEvent('signedup', { bubbles: true, composed: true }));
    } catch (err) {
      errEl.textContent = err.message || 'Failed to create account';
      errEl.style.display = 'block';
    } finally {
      btn.disabled = false;
      btn.textContent = 'Sign Up';
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      ${styles}
      <div class="auth-card">
        <h2 class="auth-title">Create Account</h2>
        <p class="auth-subtitle">Sign up to get started.</p>
        <div class="auth-error"></div>
        <form>
          <div class="auth-form-group">
            <label class="auth-label" for="email">Email address</label>
            <input type="email" id="email" class="auth-input" required />
          </div>
          <div class="auth-form-group">
            <label class="auth-label" for="password">Password</label>
            <input type="password" id="password" class="auth-input" required minlength="6" />
          </div>
          <button type="submit" class="auth-btn">Sign Up</button>
        </form>
      </div>
    `;
  }
}

class AuthUserButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.user = null;
    this.unsubscribe = null;
  }

  connectedCallback() {
    if (window.__authenticator) {
      this.user = window.__authenticator.user;
      this.unsubscribe = window.__authenticator.subscribe((user) => {
        this.user = user;
        this.render();
      });
    }
    this.render();
  }

  disconnectedCallback() {
    if (this.unsubscribe) this.unsubscribe();
  }

  async handleLogout() {
    if (window.__authenticator) {
      await window.__authenticator.logout();
      this.dispatchEvent(new CustomEvent('signedout', { bubbles: true, composed: true }));
    }
  }

  render() {
    if (!this.user) {
      this.shadowRoot.innerHTML = ``; // Hide if not logged in
      return;
    }

    const initial = this.user.email ? this.user.email[0].toUpperCase() : 'U';

    this.shadowRoot.innerHTML = `
      <style>
        .user-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #000;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: sans-serif;
          font-weight: bold;
          cursor: pointer;
          user-select: none;
          position: relative;
        }
        .dropdown {
          display: none;
          position: absolute;
          top: 45px;
          right: 0;
          background: #fff;
          border: 1px solid #eaeaea;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          min-width: 200px;
          z-index: 100;
          padding: 8px 0;
        }
        .user-btn.open .dropdown {
          display: block;
        }
        .user-info {
          padding: 8px 16px;
          border-bottom: 1px solid #eaeaea;
          margin-bottom: 8px;
        }
        .email {
          color: #111;
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .logout-btn {
          width: 100%;
          background: none;
          border: none;
          padding: 8px 16px;
          text-align: left;
          color: #d32f2f;
          font-size: 14px;
          cursor: pointer;
        }
        .logout-btn:hover {
          background: #f5f5f5;
        }
      </style>
      <div class="user-btn">
        ${initial}
        <div class="dropdown">
          <div class="user-info">
            <div class="email">${this.user.email}</div>
          </div>
          <button class="logout-btn">Sign Out</button>
        </div>
      </div>
    `;

    const btn = this.shadowRoot.querySelector('.user-btn');
    btn.addEventListener('click', (e) => {
      if (e.target.closest('.logout-btn')) {
        this.handleLogout();
      } else {
        btn.classList.toggle('open');
      }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!this.contains(e.target)) {
        btn.classList.remove('open');
      }
    });
  }
}

if (!customElements.get('auth-signin')) customElements.define('auth-signin', AuthSignIn);
if (!customElements.get('auth-signup')) customElements.define('auth-signup', AuthSignUp);
if (!customElements.get('auth-userbutton')) customElements.define('auth-userbutton', AuthUserButton);

export { Authenticator, AuthSignIn, AuthSignUp, AuthUserButton };
