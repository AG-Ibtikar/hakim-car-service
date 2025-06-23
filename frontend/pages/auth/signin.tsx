import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '../../styles/Auth.module.css';
import { authService } from '../../services/auth';

export default function SignIn() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting admin login...');
      console.log('Form data:', { ...form, password: '****' });
      
      const response = await authService.login(form.email, form.password, 'ADMIN');
      console.log('Login response:', response);
      
      if (response.user.role === 'ADMIN') {
        console.log('Login successful, redirecting to admin dashboard...');
        router.push('/admin/dashboard');
      } else {
        console.error('Invalid role:', response.user.role);
        setError('Invalid admin credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Sign In | Hakim Car Service</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.card}>
          <h1>Admin Sign In</h1>
          <p>Please sign in with your admin credentials.</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                placeholder="admin@hakim.com"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className={styles.error}>
                <p>{error}</p>
                <p className={styles.errorHint}>
                  Make sure you're using the correct credentials:
                  <br />
                  Email: admin@hakim.com
                  <br />
                  Password: admin123
                </p>
              </div>
            )}

            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
} 