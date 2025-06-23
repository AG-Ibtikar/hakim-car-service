import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import QuickServiceForm from '../components/QuickServiceForm';
import styles from '../styles/Home.module.css';
import Head from 'next/head';

interface QuickRequestPageProps {
  isAuthenticated: boolean;
}

export default function QuickRequestPage({ isAuthenticated }: QuickRequestPageProps) {
  const router = useRouter();

  // If user is not authenticated, redirect to the guest form
  if (!isAuthenticated) {
    router.replace('/quickrequest');
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <p>Redirecting to guest form...</p>
        </main>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Quick Service Request | Hakim Car Service</title>
        <meta name="description" content="Request a quick car service" />
      </Head>
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>Quick Service Request</h1>
          <p className={styles.description}>Fill out the form below to request service</p>
          <QuickServiceForm onBack={() => router.push('/')} />
        </main>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  return {
    props: {
      isAuthenticated: !!session,
    },
  };
}; 