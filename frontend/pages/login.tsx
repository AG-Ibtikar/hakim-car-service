import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';
import Header from '../components/Header';

export default function LoginSelection() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Login - Hakim Car Service</title>
        <meta name="description" content="Sign in to Hakim Car Service" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <div className={styles.container} style={{ paddingTop: '100px' }}>
        <main className={styles.main}>
          <div style={{
            maxWidth: '600px',
            width: '100%',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              color: '#2C3E50',
              marginBottom: '1rem'
            }}>
              Welcome to Hakim Car Service
            </h1>
            <p style={{
              fontSize: '1.1rem',
              color: '#7F8C8D',
              marginBottom: '3rem'
            }}>
              Choose how you'd like to sign in
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '2rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                border: '2px solid #FFD700',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
              }}
              onClick={() => router.push('/auth/login/customer')}
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: '#FFD700',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  fontSize: '1.5rem',
                  color: '#2C3E50'
                }}>
                  👤
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#2C3E50',
                  marginBottom: '0.5rem'
                }}>
                  Customer Login
                </h3>
                <p style={{
                  color: '#7F8C8D',
                  fontSize: '0.9rem',
                  lineHeight: '1.5'
                }}>
                  Access your account to book services, view vehicles, and manage your profile
                </p>
              </div>

              <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                border: '2px solid #3498DB',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
              }}
              onClick={() => router.push('/auth/signin')}
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: '#3498DB',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  fontSize: '1.5rem',
                  color: 'white'
                }}>
                  ⚙️
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#2C3E50',
                  marginBottom: '0.5rem'
                }}>
                  Admin Login
                </h3>
                <p style={{
                  color: '#7F8C8D',
                  fontSize: '0.9rem',
                  lineHeight: '1.5'
                }}>
                  Access admin dashboard to manage services, users, and system settings
                </p>
              </div>
            </div>

            <div style={{
              marginTop: '2rem',
              padding: '1rem',
              background: '#F8F9FA',
              borderRadius: '8px',
              border: '1px solid #E9ECEF'
            }}>
              <p style={{
                color: '#6C757D',
                fontSize: '0.9rem',
                margin: '0'
              }}>
                Don't have an account?{' '}
                <span 
                  style={{
                    color: '#FFD700',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                  onClick={() => router.push('/auth/register/customer')}
                >
                  Sign up here
                </span>
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
} 