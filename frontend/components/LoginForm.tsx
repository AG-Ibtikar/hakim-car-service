import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '../styles/LoginForm.module.css';
import { FaEye, FaEyeSlash, FaEnvelope, FaPhone, FaLock } from 'react-icons/fa';

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    identifier: '', // Can be email or phone
    password: '',
  });
  const [loginType, setLoginType] = useState<'email' | 'phone'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/auth/login/customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          [loginType === 'email' ? 'email' : 'phoneNumber']: formData.identifier,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard');
      } else {
        setError(data.message || 'Login failed. Please check your credentials and try again.');
      }
    } catch (err) {
      setError('Unable to connect to the server. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login - Hakim Car Service</title>
        <meta name="description" content="Login to your Hakim Car Service account" />
      </Head>

      <div className={styles.container}>
        <div className={styles.formContainer}>
          <div className={styles.header}>
            <h1>Welcome Back</h1>
            <p className={styles.subtitle}>Sign in to your account</p>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.loginTypeToggle}>
              <button
                type="button"
                className={`${styles.toggleButton} ${loginType === 'email' ? styles.active : ''}`}
                onClick={() => setLoginType('email')}
              >
                <FaEnvelope /> Email
              </button>
              <button
                type="button"
                className={`${styles.toggleButton} ${loginType === 'phone' ? styles.active : ''}`}
                onClick={() => setLoginType('phone')}
              >
                <FaPhone /> Phone
              </button>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="identifier">
                {loginType === 'email' ? <FaEnvelope className={styles.icon} /> : <FaPhone className={styles.icon} />}
                {loginType === 'email' ? 'Email' : 'Phone Number'}
              </label>
              <input
                type={loginType === 'email' ? 'email' : 'tel'}
                id="identifier"
                value={formData.identifier}
                onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                required
                placeholder={loginType === 'email' ? 'Enter your email' : 'Enter your phone number'}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">
                <FaLock className={styles.icon} />
                Password
              </label>
              <div className={styles.passwordInput}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  placeholder="Enter your password"
                  minLength={6}
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className={styles.signupLink}>
            Don't have an account?{' '}
            <button 
              onClick={() => router.push('/auth/register/customer')}
              className={styles.linkButton}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </>
  );
} 