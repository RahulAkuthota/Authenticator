import { Authenticator, AuthSignIn, AuthSignUp, AuthUserButton } from './components.js';

// Global factory for easy CDN usage
export function initAuthenticator(options) {
  window.__authenticator = new Authenticator(options);
  window.__authenticator.init();
  return window.__authenticator;
}

export { Authenticator, AuthSignIn, AuthSignUp, AuthUserButton };
export default Authenticator;
