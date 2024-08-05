import React, { useState } from 'react';
import axios from 'axios';
import styles from './LoginSignupPage.module.css'; // Import the CSS module
import qs from 'qs';

const LoginSignupPage = () => {
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const data = qs.stringify({
        username: loginUsername,
        password: loginPassword,
      });
  
      const response = await axios.post('http://localhost:8000/users/login', data, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
  
      console.log('Login success:', response.data);
      // Store the token and handle successful login
      localStorage.setItem('token', response.data.access_token);
      window.location.href = '/home'; // Redirect to the home page
    } catch (error) {
      console.error('Login error:', error.response?.data);
      setError('Invalid credentials');
    }
  };
  
  const handleSignup = async () => {
    try {
      const data = {
        username: signupUsername,
        password: signupPassword,
      };
  
      const response = await axios.post('http://localhost:8000/users/register', data);
  
      console.log('Signup success:', response.data);
      // Handle successful signup
      window.location.href = '/home'; // Redirect to the home page
    } catch (error) {
      console.error('Signup error:', error.response?.data);
      setError('Error signing up');
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
