export default class Authenticator {
  constructor(options = {}) {
    this.baseURL = options.baseURL || 'http://localhost:5000';
    this.clientId = options.clientId;
    if (!this.clientId) {
      console.error('Authenticator: clientId is required');
    }
    
    // Attempt to load tokens from local storage
    this.token = localStorage.getItem('auth_token');
    this.refreshTokenVal = localStorage.getItem('auth_refresh_token');
    this.user = null;
    this.loading = true;
    this.subscribers = [];
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.subscribers.forEach(cb => cb(this.user, this.loading));
  }

  _saveTokens(token, refreshToken) {
    this.token = token;
    this.refreshTokenVal = refreshToken;
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_refresh_token', refreshToken);
  }

  _clearTokens() {
    this.token = null;
    this.refreshTokenVal = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_refresh_token');
  }

  async _fetch(path, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      'x-client-id': this.clientId,
      ...options.headers
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    let response = await fetch(`${this.baseURL}${path}`, { ...options, headers });
    
    // Auto refresh logic if 401
    if (response.status === 401 && this.refreshTokenVal && path !== '/auth/refresh') {
      const refreshed = await this.refreshToken();
      if (refreshed) {
        headers['Authorization'] = `Bearer ${this.token}`;
        response = await fetch(`${this.baseURL}${path}`, { ...options, headers });
      }
    }

    return response;
  }

  async init() {
    if (this.token) {
      await this.getUser();
    } else {
      this.loading = false;
      this.notify();
    }
  }

  async signup(email, password) {
    this.loading = true;
    this.notify();
    try {
      const res = await this._fetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');
      
      this._saveTokens(data.token, data.refreshToken);
      this.user = data.user;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      this.loading = false;
      this.notify();
    }
  }

  async login(email, password) {
    this.loading = true;
    this.notify();
    try {
      const res = await this._fetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      this._saveTokens(data.token, data.refreshToken);
      this.user = data.user;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      this.loading = false;
      this.notify();
    }
  }

  async logout() {
    this.loading = true;
    this.notify();
    try {
      if (this.refreshTokenVal) {
        await this._fetch('/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refreshToken: this.refreshTokenVal })
        });
      }
      this._clearTokens();
      this.user = null;
    } catch (err) {
      console.error(err);
    } finally {
      this.loading = false;
      this.notify();
    }
  }

  async getUser() {
    try {
      const res = await this._fetch('/auth/me');
      if (res.ok) {
        const data = await res.json();
        this.user = data.user;
      } else {
        this._clearTokens();
        this.user = null;
      }
    } catch (err) {
      this._clearTokens();
      this.user = null;
    } finally {
      this.loading = false;
      this.notify();
    }
  }

  async refreshToken() {
    try {
      const res = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-client-id': this.clientId },
        body: JSON.stringify({ refreshToken: this.refreshTokenVal })
      });
      if (res.ok) {
        const data = await res.json();
        this._saveTokens(data.token, data.refreshToken);
        return true;
      } else {
        this._clearTokens();
        this.user = null;
        return false;
      }
    } catch (err) {
      this._clearTokens();
      this.user = null;
      return false;
    }
  }
}
