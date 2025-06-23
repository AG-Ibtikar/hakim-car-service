import { useRouter } from 'next/router';
import Head from 'next/head';
import OnboardingSlides from '../components/OnboardingSlides';

export default function Onboarding() {
  const router = useRouter();

  const handleRegister = () => {
    router.push('/auth/register/customer');
  };

  const handleComplete = () => {
    router.push('/');
  };

  const handleGuest = () => {
    router.push('/quickrequest');
  };

  return (
    <>
      <Head>
        <title>Welcome to Hakim Car Service</title>
        <meta name="description" content="Get started with Hakim Car Service" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <OnboardingSlides
        onComplete={handleComplete}
        onRegister={handleRegister}
        onGuest={handleGuest}
      />
    </>
  );
} 