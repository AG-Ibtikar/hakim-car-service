import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '../styles/RegistrationForm.module.css';
import { FaEye, FaEyeSlash, FaUser, FaPhone, FaEnvelope, FaLock, FaCity } from 'react-icons/fa';

const IRAQI_CITIES = [
  'Baghdad',
  'Mosul',
  'Basra',
  'Erbil',
  'Sulaymaniyah',
  'Kirkuk',
  'Najaf',
  'Karbala',
  'Nasiriyah',
  'Ramadi',
  'Fallujah',
  'Samarra',
  'Tikrit',
  'Duhok',
  'Halabja',
  'Amara',
  'Kut',
  'Diyala',
  'Anbar',
  'Maysan'
];

export default function RegistrationForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
    city: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep1 = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.city) {
      setError('Please fill in all required fields');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.phoneNumber.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError('');
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateStep2()) {
      return;
    }

    setLoading(true);

    try {
      console.log('Submitting registration data:', formData);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/register/customer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Registration response:', data);

      if (response.ok) {
        // Store the token in localStorage
        localStorage.setItem('token', data.access_token);
        // Store user data
        localStorage.setItem('user', JSON.stringify(data.user));
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        setError('Unable to connect to the server. Please make sure the backend server is running on port 3001.');
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign Up - Hakim Car Service</title>
        <meta name="description" content="Create your Hakim Car Service account" />
      </Head>

      <div className={styles.container}>
        <div className={styles.formContainer}>
          <div className={styles.header}>
            <h1>Create Account</h1>
            <p className={styles.subtitle}>Join Hakim Car Service today</p>
          </div>

          <div className={styles.progressBar}>
            <div 
              className={styles.progress} 
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            {currentStep === 1 ? (
              <div className={styles.step}>
                <div className={styles.inputGroup}>
                  <label htmlFor="firstName">
                    <FaUser className={styles.icon} />
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your first name"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="lastName">
                    <FaUser className={styles.icon} />
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your last name"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="city">
                    <FaCity className={styles.icon} />
                    City
                  </label>
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className={styles.select}
                  >
                    <option value="">Select your city</option>
                    {IRAQI_CITIES.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <button 
                  type="button" 
                  onClick={handleNext}
                  className={styles.nextButton}
                >
                  Next
                </button>
              </div>
            ) : (
              <div className={styles.step}>
                <div className={styles.inputGroup}>
                  <label htmlFor="phoneNumber">
                    <FaPhone className={styles.icon} />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="email">
                    <FaEnvelope className={styles.icon} />
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
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
                      placeholder="Create a password"
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

                <div className={styles.buttonGroup}>
                  <button 
                    type="button" 
                    onClick={handleBack}
                    className={styles.backButton}
                  >
                    Back
                  </button>
                  <button 
                    type="submit" 
                    className={styles.submitButton}
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </div>
              </div>
            )}
          </form>

          <p className={styles.loginLink}>
            Already have an account?{' '}
            <button 
              onClick={() => router.push('/auth/login')}
              className={styles.linkButton}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </>
  );
} 