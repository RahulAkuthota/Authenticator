import React from 'react';

// For React, we can either re-implement the UI natively in React using useAuth(), 
// or simply wrap the web components.
// Here we'll wrap the web components for consistency in styling and behavior, 
// since we built them in the SDK.

export const AuthSignIn = ({ onSignedIn }) => {
  const ref = React.useRef();

  React.useEffect(() => {
    const el = ref.current;
    if (el) {
      const handler = () => {
        if (onSignedIn) onSignedIn();
      };
      el.addEventListener('signedin', handler);
      return () => el.removeEventListener('signedin', handler);
    }
  }, [onSignedIn]);

  return <auth-signin ref={ref}></auth-signin>;
};

export const AuthSignUp = ({ onSignedUp }) => {
  const ref = React.useRef();

  React.useEffect(() => {
    const el = ref.current;
    if (el) {
      const handler = () => {
        if (onSignedUp) onSignedUp();
      };
      el.addEventListener('signedup', handler);
      return () => el.removeEventListener('signedup', handler);
    }
  }, [onSignedUp]);

  return <auth-signup ref={ref}></auth-signup>;
};

export const UserButton = ({ onSignedOut }) => {
  const ref = React.useRef();

  React.useEffect(() => {
    const el = ref.current;
    if (el) {
      const handler = () => {
        if (onSignedOut) onSignedOut();
      };
      el.addEventListener('signedout', handler);
      return () => el.removeEventListener('signedout', handler);
    }
  }, [onSignedOut]);

  return <auth-userbutton ref={ref}></auth-userbutton>;
};
