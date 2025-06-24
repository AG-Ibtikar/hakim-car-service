import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/RegistrationOnboarding.module.css';
import { FaCar, FaTruck, FaCarSide, FaTools, FaWrench, FaEye, FaEyeSlash } from 'react-icons/fa';
import { vehicleMakes } from '../data/vehicles';
import { iraqiCities } from '../data/cities';

interface FormData {
  fullName: string;
  city: string;
  phoneNumber: string;
  password: string;
  email: string;
  vehicleType: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  vehicleColor: string;
  serviceInterests: string[];
}

interface FormErrors extends Partial<FormData> {
  submit?: string;
}

const vehicleTypes = [
  { id: 'sedan', label: 'Sedan', icon: <FaCar /> },
  { id: 'suv', label: 'SUV', icon: <FaCarSide /> },
  { id: 'hatchback', label: 'Hatchback', icon: <FaCar /> },
  { id: 'pickup', label: 'Pickup', icon: <FaTruck /> },
  { id: 'van', label: 'Van', icon: <FaTruck /> }
];

const serviceOptions = [
  { id: 'tow', label: 'Tow Truck', icon: <FaTruck /> },
  { id: 'emergency', label: 'Emergency Van', icon: <FaCarSide /> },
  { id: 'maintenance', label: 'Maintenance', icon: <FaTools /> },
  { id: 'quick', label: 'Quick Service', icon: <FaCarSide /> },
  { id: 'hakim', label: 'Hakim Garage', icon: <FaWrench /> }
];

export default function RegistrationOnboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    city: '',
    phoneNumber: '',
    password: '',
    email: '',
    vehicleType: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    vehicleColor: '',
    serviceInterests: []
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const router = useRouter();

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<FormData> = {};

    switch (step) {
      case 1:
        if (!formData.fullName.trim()) {
          newErrors.fullName = 'Full name is required';
        }
        if (!formData.city) {
          newErrors.city = 'Please select your city';
        }
        break;
      case 2:
        if (!formData.phoneNumber.match(/^\+?[1-9]\d{1,14}$/)) {
          newErrors.phoneNumber = 'Please enter a valid phone number';
        }
        break;
      case 3:
        if (!formData.password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)) {
          newErrors.password = 'Password must be at least 8 characters with 1 number';
        }
        break;
      case 4:
        if (!formData.vehicleType) {
          newErrors.vehicleType = 'Please select a vehicle type';
        }
        if (!formData.vehicleMake) {
          newErrors.vehicleMake = 'Please select a vehicle make';
        }
        if (!formData.vehicleModel) {
          newErrors.vehicleModel = 'Please select a vehicle model';
        }
        if (!formData.vehicleYear) {
          newErrors.vehicleYear = 'Please enter vehicle year';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
      } else {
        // Submit form
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    router.push('/');
  };

  const handleSubmit = async () => {
    try {
      // Format the data to match backend expectations
      const registrationData = {
        firstName: formData.fullName.split(' ')[0],
        lastName: formData.fullName.split(' ').slice(1).join(' '),
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        city: formData.city,
        role: 'CUSTOMER'
      };

      console.log('Sending registration data:', registrationData);

      const response = await fetch('/api/auth/register/customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
        credentials: 'include', // Include cookies in the request
      });

      console.log('Response status:', response.status);

      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        router.push('/auth/login');
      } else {
        setErrors({ 
          ...errors, 
          submit: data.message || 'Registration failed. Please try again.' 
        });
        console.error('Registration failed:', data);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setErrors({ 
        ...errors, 
        submit: 'Unable to connect to the server. Please check your internet connection and try again.' 
      });
    }
  };

  const getModelsForMake = (makeId: string) => {
    const make = vehicleMakes.find(m => m.id === makeId);
    return make ? make.models : [];
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className={styles.step}>
            <h2>Welcome to Hakim Car Service</h2>
            <p>Let's get started with your registration</p>
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className={errors.fullName ? styles.error : ''}
              />
              {errors.fullName && <span className={styles.errorText}>{errors.fullName}</span>}
            </div>
            <div className={styles.inputGroup}>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className={errors.city ? styles.error : ''}
              >
                <option value="">Select your city</option>
                {iraqiCities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name} - {city.governorate}
                  </option>
                ))}
              </select>
              {errors.city && <span className={styles.errorText}>{errors.city}</span>}
            </div>
          </div>
        );

      case 2:
        return (
          <div className={styles.step}>
            <h2>Hi {formData.fullName}, please add your phone number</h2>
            <div className={styles.inputGroup}>
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className={errors.phoneNumber ? styles.error : ''}
              />
              {errors.phoneNumber && <span className={styles.errorText}>{errors.phoneNumber}</span>}
            </div>
            <div className={styles.inputGroup}>
  <label htmlFor="email">Email (optional)</label>
  <input
    type="email"
    id="email"
    value={formData.email}
    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
    placeholder="Enter your email"
  />
</div>
          </div>
        );

      case 3:
        return (
          <div className={styles.step}>
            <h2>Create a Secure Password</h2>
            <div className={styles.inputGroup}>
              <div className={styles.passwordInput}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={errors.password ? styles.error : ''}
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <span className={styles.errorText}>{errors.password}</span>}
            </div>
          </div>
        );

      case 4:
        return (
          <div className={styles.step}>
            <h2>Tell us about your vehicle</h2>
            <div className={styles.vehicleTypes}>
              {vehicleTypes.map((type) => (
                <button
                  key={type.id}
                  className={`${styles.vehicleType} ${formData.vehicleType === type.id ? styles.selected : ''}`}
                  onClick={() => setFormData({ ...formData, vehicleType: type.id })}
                >
                  {type.icon}
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
            {errors.vehicleType && <span className={styles.errorText}>{errors.vehicleType}</span>}
            
            <div className={styles.inputGroup}>
              <select
                value={formData.vehicleMake}
                onChange={(e) => {
                  const makeId = e.target.value;
                  setFormData({ 
                    ...formData, 
                    vehicleMake: makeId,
                    vehicleModel: '' // Reset model when make changes
                  });
                }}
                className={errors.vehicleMake ? styles.error : ''}
              >
                <option value="">Select Make</option>
                {vehicleMakes.map((make) => (
                  <option key={make.id} value={make.id}>
                    {make.name}
                  </option>
                ))}
              </select>
              {errors.vehicleMake && <span className={styles.errorText}>{errors.vehicleMake}</span>}
            </div>

            <div className={styles.inputGroup}>
              <select
                value={formData.vehicleModel}
                onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                className={errors.vehicleModel ? styles.error : ''}
                disabled={!formData.vehicleMake}
              >
                <option value="">Select Model</option>
                {getModelsForMake(formData.vehicleMake).map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
              {errors.vehicleModel && <span className={styles.errorText}>{errors.vehicleModel}</span>}
            </div>

            <div className={styles.inputGroup}>
              <input
                type="number"
                placeholder="Vehicle Year"
                value={formData.vehicleYear}
                onChange={(e) => setFormData({ ...formData, vehicleYear: e.target.value })}
                className={errors.vehicleYear ? styles.error : ''}
                min="1900"
                max={new Date().getFullYear() + 1}
              />
              {errors.vehicleYear && <span className={styles.errorText}>{errors.vehicleYear}</span>}
            </div>

            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Vehicle Color (optional)"
                value={formData.vehicleColor}
                onChange={(e) => setFormData({ ...formData, vehicleColor: e.target.value })}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className={styles.step}>
            <h2>Which service are you most interested in?</h2>
            <div className={styles.serviceOptions}>
              {serviceOptions.map((service) => (
                <button
                  key={service.id}
                  className={`${styles.serviceOption} ${
                    formData.serviceInterests.includes(service.id) ? styles.selected : ''
                  }`}
                  onClick={() => {
                    const interests = formData.serviceInterests.includes(service.id)
                      ? formData.serviceInterests.filter((id) => id !== service.id)
                      : [...formData.serviceInterests, service.id];
                    setFormData({ ...formData, serviceInterests: interests });
                  }}
                >
                  {service.icon}
                  <span>{service.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.progress}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>
        <span className={styles.progressText}>
          Step {currentStep} of 5
        </span>
      </div>

      <div className={styles.content}>
        {errors.submit && (
          <div className={styles.errorMessage}>
            {errors.submit}
          </div>
        )}
        {renderStep()}
      </div>

      <div className={styles.navigation}>
        {currentStep > 1 && (
          <button className={styles.backButton} onClick={handleBack}>
            Back
          </button>
        )}
        {currentStep === 3 && (
          <button className={styles.skipButton} onClick={handleSkip}>
            Skip Onboarding
          </button>
        )}
        <button className={styles.nextButton} onClick={handleNext}>
          {currentStep === 5 ? 'Complete Registration' : 'Next'}
        </button>
      </div>
    </div>
  );
} 