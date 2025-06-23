import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/OnboardingSlides.module.css';
import { FaTruck, FaMapMarkerAlt, FaShieldAlt, FaUser, FaUserPlus } from 'react-icons/fa';

interface OnboardingSlidesProps {
  onComplete: () => void;
  onRegister: () => void;
  onGuest: () => void;
}

export default function OnboardingSlides({ onComplete, onRegister, onGuest }: OnboardingSlidesProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  const slides = [
    {
      title: 'Welcome to Hakim Car Service',
      description: 'Your trusted partner for all automotive needs',
      icon: <FaTruck />,
      content: (
        <div className={styles.slideContent}>
          <h3>Our Services</h3>
          <ul>
            <li>24/7 Towing Service</li>
            <li>Emergency Roadside Assistance</li>
            <li>Quick Fix Solutions</li>
            <li>Professional Maintenance</li>
          </ul>
        </div>
      )
    },
    {
      title: 'Why Choose Hakim?',
      description: 'Experience the difference with our premium services',
      icon: <FaShieldAlt />,
      content: (
        <div className={styles.slideContent}>
          <h3>Key Benefits</h3>
          <ul>
            <li>Real-time Service Tracking</li>
            <li>Service Warranty</li>
            <li>Home Pickup & Delivery</li>
            <li>Expert Technicians</li>
          </ul>
        </div>
      )
    },
    {
      title: 'Get Started',
      description: 'Choose how you want to use Hakim',
      icon: <FaUser />,
      content: (
        <div className={styles.slideContent}>
          <div className={styles.userOptions}>
            <div className={styles.option}>
              <FaUser />
              <h3>Continue as Guest</h3>
              <p>Access basic services without registration</p>
              <button 
                className={styles.guestButton}
                onClick={onGuest}
              >
                Continue as Guest
              </button>
            </div>
            <div className={styles.option}>
              <FaUserPlus />
              <h3>Register Now</h3>
              <p>Get full access to all features and benefits</p>
              <button 
                className={styles.registerButton}
                onClick={onRegister}
              >
                Register Now
              </button>
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handleBack = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleSkip = () => {
    router.push('/');
  };

  return (
    <div className={styles.container}>
      <div className={styles.progress}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
          />
        </div>
        <span className={styles.progressText}>
          Step {currentSlide + 1} of {slides.length}
        </span>
      </div>

      <div className={styles.slide}>
        <div className={styles.icon}>{slides[currentSlide].icon}</div>
        <h2>{slides[currentSlide].title}</h2>
        <p>{slides[currentSlide].description}</p>
        {slides[currentSlide].content}
      </div>

      <div className={styles.navigation}>
        {currentSlide > 0 && (
          <button className={styles.backButton} onClick={handleBack}>
            Back
          </button>
        )}
        {currentSlide < slides.length - 1 && (
          <button className={styles.nextButton} onClick={handleNext}>
            Next
          </button>
        )}
        {currentSlide === slides.length - 1 && (
          <button className={styles.skipButton} onClick={handleSkip}>
            Skip
          </button>
        )}
      </div>
    </div>
  );
} 