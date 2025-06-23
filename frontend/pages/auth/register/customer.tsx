import Head from 'next/head';
import RegistrationForm from '../../../components/RegistrationForm';
import Header from '../../../components/Header';
import styles from '../../../styles/Home.module.css';

export default function CustomerRegistration() {
  return (
    <>
      <Head>
        <title>Register - Hakim Car Service</title>
        <meta name="description" content="Create your account with Hakim Car Service" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <div className={styles.container} style={{ paddingTop: '100px' }}>
        <main className={styles.main}>
          <RegistrationForm />
        </main>
      </div>
    </>
  );
} 