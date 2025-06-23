import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import onboardingStyles from '../styles/OnboardingSlides.module.css';
import { FaCar, FaTruck, FaCarSide, FaTools, FaWrench, FaDotCircle, FaCarAlt, FaTruckMoving, FaMotorcycle, FaBus } from 'react-icons/fa';
import { serviceRequestsApi, CreateServiceRequestDto } from '../services/service-requests';

const vehicleTypes = [
  { id: 'sedan', label: 'Sedan', icon: <FaCarAlt /> },
  { id: 'suv', label: 'SUV', icon: <FaCarSide /> },
  { id: 'crossover', label: 'Crossover', icon: <FaCarSide /> },
  { id: 'bus', label: 'Bus', icon: <FaBus /> },
  { id: 'truck', label: 'Truck', icon: <FaTruckMoving /> },
  { id: 'motorbike', label: 'Motorbike', icon: <FaMotorcycle /> }
];

const carMakes = [
  { id: 'toyota', label: 'Toyota', models: ['Corolla', 'Camry', 'RAV4', 'Hilux'] },
  { id: 'honda', label: 'Honda', models: ['Civic', 'Accord', 'CR-V', 'Fit'] },
  { id: 'ford', label: 'Ford', models: ['Focus', 'Fiesta', 'Explorer', 'F-150'] },
  { id: 'hyundai', label: 'Hyundai', models: ['Elantra', 'Sonata', 'Tucson', 'Santa Fe'] },
  { id: 'other', label: 'Other', models: ['Other'] }
];

const serviceOptions = [
  { id: 'emergency', label: 'Emergency', icon: <FaCarSide /> },
  { id: 'tow', label: 'Tow Truck', icon: <FaTruck /> }
];

interface QuickServiceFormProps {
  onBack: () => void;
}

export default function QuickServiceForm({ onBack }: QuickServiceFormProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    location: '',
    carType: '',
    make: '',
    model: '',
    service: '',
    notes: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [locating, setLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/signin?callbackUrl=/qrequest');
    }
  }, [status, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleCarType = (type: string) => {
    setForm({ ...form, carType: type, make: '', model: '' });
    setError('');
  };

  const handleService = (service: string) => {
    setForm({ ...form, service });
    setError('');
  };

  const handleLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          setForm(f => ({ ...f, location: data.display_name || `${latitude}, ${longitude}` }));
        } catch {
          setForm(f => ({ ...f, location: `${latitude}, ${longitude}` }));
        }
        setLocating(false);
      },
      () => {
        setError('Unable to retrieve your location.');
        setLocating(false);
      }
    );
  };

  const getModelsForMake = (makeId: string) => {
    const make = carMakes.find(m => m.id === makeId);
    return make ? make.models : [];
  };

  const handleMakeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, make: e.target.value, model: '' });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsSubmitting(true);

    if (status !== 'authenticated' || !session) {
      setError('Please log in to submit a service request');
      setIsSubmitting(false);
      router.replace('/auth/signin?callbackUrl=/qrequest');
      return;
    }

    if (!form.name || !form.phone || !form.location || !form.carType || !form.make || !form.model || !form.service) {
      setError('Please fill in all fields.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Parse location string into coordinates and address
      const locationParts = form.location.split(',');
      const location = {
        latitude: parseFloat(locationParts[0]),
        longitude: parseFloat(locationParts[1]),
        address: form.location
      };

      const requestData: CreateServiceRequestDto = {
        serviceType: form.service.toUpperCase() as 'EMERGENCY' | 'TOW',
        location: location,
        description: form.notes || `Service request for ${form.make} ${form.model} (${form.carType})`,
        customerName: form.name,
        customerPhone: form.phone,
        vehicleType: form.carType,
        make: form.make,
        model: form.model
      };

      await serviceRequestsApi.createServiceRequest(requestData);
      setSuccess(true);
    } catch (err) {
      console.error('Form submission error:', err);
      if (err instanceof Error && err.message === 'No authentication token found') {
        setError('Please log in to submit a service request');
        router.replace('/auth/signin?callbackUrl=/qrequest');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to submit request. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Please log in to submit a service request</p>
        <button className={onboardingStyles.nextButton} onClick={() => router.replace('/auth/signin?callbackUrl=/qrequest')}>
          Log In
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div style={{textAlign: 'center', margin: '3rem 0'}}>
        <h2 style={{color: '#38a169', fontSize: '2.5rem', marginBottom: '1rem'}}>✓</h2>
        <h2>Request Submitted Successfully!</h2>
        <p style={{color: '#38a169', fontWeight: 500}}>We've received your service request and will contact you shortly.</p>
        <p style={{marginTop: '1rem', color: '#4a5568'}}>A confirmation message has been sent to your WhatsApp.</p>
        <button className={onboardingStyles.backButton} onClick={onBack} style={{marginTop: '2rem'}}>Back to Home</button>
      </div>
    );
  }

  // Modern, borderless, rounded field style
  const fieldStyle = {
    background: '#fff',
    border: 'none',
    borderRadius: 16,
    boxShadow: '0 1px 4px rgba(66,153,225,0.07)',
    padding: '1.1rem 1.2rem',
    fontSize: '1.08rem',
    marginTop: 4,
    marginBottom: 0,
    width: '100%',
    outline: 'none',
    transition: 'box-shadow 0.2s',
  } as React.CSSProperties;

  const fieldFocusStyle = {
    boxShadow: '0 0 0 2px #4299e1',
  };

  return (
    <form onSubmit={handleSubmit} style={{width: '100%', maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', background: 'none', boxShadow: 'none', borderRadius: 0}}>
      {/* Contact Section */}
      <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
        <label htmlFor="name" style={{fontWeight: 600, color: '#2d3748', marginBottom: 2}}>Full Name</label>
        <input name="name" id="name" placeholder="Full Name" value={form.name} onChange={handleChange} required style={fieldStyle} />
        <label htmlFor="phone" style={{fontWeight: 600, color: '#2d3748', marginBottom: 2}}>Phone Number</label>
        <input name="phone" id="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required style={fieldStyle} />
        <label htmlFor="location" style={{fontWeight: 600, color: '#2d3748', marginBottom: 2}}>Location</label>
        <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
          <input name="location" id="location" placeholder="Location" value={form.location} onChange={handleChange} required style={{...fieldStyle, flex: 1}} />
          <button type="button" className={onboardingStyles.nextButton} style={{padding: '0.9rem 1.2rem', minWidth: 44, height: 52}} onClick={handleLocation} disabled={locating}>{locating ? 'Locating...' : '📍'}</button>
        </div>
      </div>

      {/* Vehicle Section */}
      <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
        <label style={{fontWeight: 600, color: '#2d3748', marginBottom: 2}}>Car Type</label>
        <div style={{display: 'flex', gap: 12, marginTop: 4}}>
          {vehicleTypes.map(type => (
            <button
              key={type.id}
              type="button"
              className={onboardingStyles.input}
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                border: form.carType === type.id ? '2px solid #4299e1' : 'none',
                background: form.carType === type.id ? '#ebf8ff' : '#f7fafc',
                color: form.carType === type.id ? '#4299e1' : '#4a5568',
                fontSize: 22,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: form.carType === type.id ? '0 2px 8px rgba(66,153,225,0.10)' : 'none',
              }}
              onClick={() => handleCarType(type.id)}
              aria-label={type.label}
            >
              {type.icon}
            </button>
          ))}
        </div>
        {form.carType && (
          <>
            <label htmlFor="make" style={{fontWeight: 600, color: '#2d3748', marginBottom: 2}}>Car Make</label>
            <select name="make" id="make" value={form.make} onChange={handleMakeChange} required style={fieldStyle}>
              <option value="">Select Make</option>
              {carMakes.map(make => (
                <option key={make.id} value={make.id}>{make.label}</option>
              ))}
            </select>
            <label htmlFor="model" style={{fontWeight: 600, color: '#2d3748', marginBottom: 2}}>Car Model</label>
            <select name="model" id="model" value={form.model} onChange={handleChange} required style={fieldStyle}>
              <option value="">Select Model</option>
              {getModelsForMake(form.make).map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </>
        )}
      </div>

      {/* Service Section */}
      <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
        <label style={{fontWeight: 600, color: '#2d3748', marginBottom: 2}}>Service</label>
        <div style={{display: 'flex', gap: 12, marginTop: 4, flexWrap: 'wrap'}}>
          {serviceOptions.map(opt => (
            <button
              key={opt.id}
              type="button"
              className={onboardingStyles.input}
              style={{
                width: 72,
                height: 72,
                borderRadius: 16,
                border: form.service === opt.id ? '2px solid #4299e1' : 'none',
                background: form.service === opt.id ? '#ebf8ff' : '#f7fafc',
                color: form.service === opt.id ? '#4299e1' : '#4a5568',
                fontSize: 26,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: form.service === opt.id ? '0 2px 8px rgba(66,153,225,0.10)' : 'none',
              }}
              onClick={() => handleService(opt.id)}
              aria-label={opt.label}
            >
              {opt.icon}
              <span style={{fontSize: 12, marginTop: 4}}>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Notes Section */}
      <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
        <label htmlFor="notes" style={{fontWeight: 600, color: '#2d3748', marginBottom: 2}}>Notes</label>
        <textarea name="notes" id="notes" placeholder="Additional notes (optional)" value={form.notes} onChange={handleChange} style={{...fieldStyle, minHeight: 64, resize: 'vertical'}} />
      </div>

      {error && <div className={onboardingStyles.errorText} style={{margin: '1rem 0'}}>{error}</div>}

      <div style={{display: 'flex', gap: '1.5rem', marginTop: '2rem', justifyContent: 'flex-end'}}>
        <button type="button" className={onboardingStyles.backButton} onClick={onBack} style={{minWidth: 120}}>Back</button>
        <button type="submit" className={onboardingStyles.nextButton} style={{minWidth: 120}} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  );
} 