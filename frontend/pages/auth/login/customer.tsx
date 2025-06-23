import Head from 'next/head';
import CustomerLoginForm from '../../../components/CustomerLoginForm';
import Header from '../../../components/Header';
import styles from '../../../styles/Home.module.css';

export default function CustomerLogin() {
  return (
    <>
      <Head>
        <title>Sign In - Hakim Car Service</title>
        <meta name="description" content="Sign in to your Hakim Car Service account" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <div className={styles.container} style={{ paddingTop: '100px' }}>
        <main className={styles.main}>
          <CustomerLoginForm />
        </main>
      </div>
    </>
  );
} 