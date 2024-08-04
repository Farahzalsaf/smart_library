import React, { useState } from 'react';
import styles from './LoginSignupPage.module.css'; // Import the CSS module

const LoginSignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Login:', { email, password });
  };

  const handleSignup = () => {
    console.log('Signup:', { email, password });
  };

  return (
    <div className={styles['login-signup-container']}>
      <div className={styles['form-container']}>
        <h2>Log In</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@pwc.com"
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Placeholder/Input text"
          />
          <button type="submit">Log In</button>
        </form>

        <hr className={styles.divider} />

        <h2>Sign Up</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleSignup(); }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@pwc.com"
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Placeholder/Input text"
          />
          <p className={styles['password-requirements']}>
            Ensure password has:
            <br />• 8 characters or more
            <br />• At least one number
            <br />• No symbols
          </p>
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default LoginSignupPage;
