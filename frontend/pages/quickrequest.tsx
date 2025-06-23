import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import GuestQuickServiceForm from '../components/GuestQuickServiceForm';
import styles from '../styles/Home.module.css';
import Head from 'next/head';
import Header from '../components/Header';

interface QuickRequestPageProps {
  isAuthenticated: boolean;
}

export default function QuickRequestPage({ isAuthenticated }: QuickRequestPageProps) {
  const router = useRouter();

  // If user is authenticated, redirect to the authenticated form
  if (isAuthenticated) {
    router.replace('/qrequest');
    return (
      <>
        <Header />
        <div className={styles.container} style={{ paddingTop: '100px' }}>
          <main className={styles.main}>
            <p>Redirecting to authenticated form...</p>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Quick Service Request | Hakim Car Service</title>
        <meta name="description" content="Request a quick car service" />
      </Head>
      <Header />
      <div className={styles.container} style={{ paddingTop: '100px' }}>
        <main className={styles.main}>
          <h1 className={styles.title}>Quick Service Request</h1>
          <p className={styles.description}>Fill out the form below to request service</p>
          <GuestQuickServiceForm onBack={() => router.push('/')} />
        </main>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
  const session = await getSession(context);
  return {
    props: {
      isAuthenticated: !!session,
    },
  };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        isAuthenticated: false,
      },
    };
  }
}; 