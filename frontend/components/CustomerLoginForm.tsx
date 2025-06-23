import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '../styles/RegistrationForm.module.css';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from 'react-icons/fa';
import { authService } from '../services/auth';

export default function CustomerLoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting customer login with:', { email: formData.email });
      
      const response = await authService.login(formData.email, formData.password, 'CUSTOMER');
      console.log('Login response:', response);

      if (response.user.role === 'CUSTOMER') {
        console.log('Login successful, checking localStorage...');
        
        // Check what's stored in localStorage
        const adminToken = localStorage.getItem('adminToken');
        const adminUser = localStorage.getItem('adminUser');
        const regularToken = localStorage.getItem('token');
        const regularUser = localStorage.getItem('user');
        
        console.log('localStorage after login:', {
          adminToken: adminToken ? 'present' : 'missing',
          adminUser: adminUser ? 'present' : 'missing',
          regularToken: regularToken ? 'present' : 'missing',
          regularUser: regularUser ? 'present' : 'missing'
        });
        
        console.log('Waiting 500ms before redirect...');
        setTimeout(() => {
          console.log('Redirecting to dashboard...');
          router.push('/dashboard');
        }, 500);
      } else {
        throw new Error('Invalid customer credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign In - Hakim Car Service</title>
        <meta name="description" content="Sign in to your Hakim Car Service account" />
      </Head>

      <div className={styles.container}>
        <div className={styles.formContainer}>
          <div className={styles.header}>
            <h1>Welcome Back</h1>
            <p className={styles.subtitle}>Sign in to your account</p>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.step}>
              <div className={styles.inputGroup}>
                <label htmlFor="email">
                  <FaEnvelope className={styles.icon} />
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your email"
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
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your password"
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
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>
          </form>

          <p className={styles.loginLink}>
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