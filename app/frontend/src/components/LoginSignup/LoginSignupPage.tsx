import React, { useState } from 'react';
import axios from 'axios';
import styles from './LoginSignupPage.module.css';
import qs from 'qs';

interface LoginSignupPageProps {
  setAuthenticated: (isAuthenticated: boolean) => void;
}

const LoginSignupPage: React.FC<LoginSignupPageProps> = ({ setAuthenticated }) => {
  const [loginUsername, setLoginUsername] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [signupUsername, setSignupUsername] = useState<string>('');
  const [signupPassword, setSignupPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const apiUrl = process.env.REACT_APP_URL || '';

  const handleLogin = async () => {
    try {
      const data = qs.stringify({
        username: loginUsername,
        password: loginPassword,
      });

      const response = await axios.post(`${apiUrl}/users/login`, data, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      console.log('response', response);

      if (response.status === 200) {
        console.log('Login success:', response.data);
        localStorage.setItem('token', response.data.access_token);
        setAuthenticated(true);
        setError('');
        console.log('Redirecting to /admin...');
        window.location.href = '/admin';
      } else {
        console.error('Unexpected response:', response);
        setError('Unexpected response from server.');
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        console.error('Login error:', error.response.data);
        setError(error.response.data.detail || 'Invalid credentials');
      } else {
        console.error('Login error:', error.message);
        setError('An unexpected error occurred. Please try again later.');
      }
    }
  };

  const handleSignup = async () => {
    try {
      const data = {
        username: signupUsername,
        password: signupPassword,
      };

      const response = await axios.post(`${apiUrl}/users/register`, data);

      if (response.status === 200) {
        console.log('Signup success:', response.data);
        setError('');
        setAuthenticated(true);
        console.log('Redirecting to /admin...');
        window.location.href = '/admin';
      } else {
        console.error('Unexpected response:', response);
        setError('Unexpected response from server.');
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        console.error('Signup error:', error.response.data);
        setError(error.response.data.detail || 'Error signing up');
      } else {
        console.error('Signup error:', error.message);
        setError('An unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className={styles['login-signup-container']}>
      <div className={styles['form-container']}>
        <h2>Log In</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <label>Username</label>
          <input
            type="text"
            value={loginUsername}
            onChange={(e) => setLoginUsername(e.target.value)}
            placeholder="Your username"
          />
          <label>Password</label>
          <input
            type="password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            placeholder="Placeholder/Input text"
          />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit">Log In</button>
        </form>

        <hr className={styles.divider} />

        <h2>Sign Up</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSignup();
          }}
        >
          <label>Username</label>
          <input
            type="text"
            value={signupUsername}
            onChange={(e) => setSignupUsername(e.target.value)}
            placeholder="Your username"
          />
          <label>Password</label>
          <input
            type="password"
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
            placeholder="Placeholder/Input text"
          />
          <p className={styles['password-requirements']}>
            Ensure password has:
            <br />• 8 characters or more
            <br />• At least one number
            <br />• No symbols
          </p>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default LoginSignupPage;
