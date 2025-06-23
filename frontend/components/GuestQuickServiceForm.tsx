import { useState } from 'react';
import { useRouter } from 'next/router';
import { FaCar, FaTruck, FaCarSide, FaTools, FaWrench, FaDotCircle, FaCarAlt, FaTruckMoving, FaMotorcycle, FaBus, FaMapMarkerAlt, FaUser, FaPhone, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';
import styles from '../styles/GuestQuickServiceForm.module.css';

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
  { id: 'MAINTENANCE', label: 'Maintenance', icon: <FaTools /> },
  { id: 'REPAIR', label: 'Repair', icon: <FaWrench /> },
  { id: 'DIAGNOSTIC', label: 'Diagnostic', icon: <FaDotCircle /> },
  { id: 'CLEANING', label: 'Cleaning', icon: <FaCar /> },
  { id: 'TIRE_SERVICE', label: 'Tire Service', icon: <FaCarSide /> },
  { id: 'OTHER', label: 'Other', icon: <FaCarAlt /> }
];

interface GuestQuickServiceFormProps {
  onBack: () => void;
}

interface ServiceRequestDetails {
  id: string;
  serviceType: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  description: string;
  customerName: string;
  customerPhone: string;
  vehicleType: string;
  make: string;
  model: string;
  status: string;
  createdAt: string;
}

export default function GuestQuickServiceForm({ onBack }: GuestQuickServiceFormProps) {
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
  const [requestDetails, setRequestDetails] = useState<ServiceRequestDetails | null>(null);

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

    if (!form.name || !form.phone || !form.location || !form.carType || !form.make || !form.model || !form.service) {
      setError('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    try {
      const locationParts = form.location.split(',').map(part => part.trim());
      const location = {
        latitude: parseFloat(locationParts[0]) || 0,
        longitude: parseFloat(locationParts[1]) || 0,
        address: form.location
      };

      const requestData = {
        serviceType: form.service,
        location: location,
        description: form.notes || `Service request for ${form.make} ${form.model} (${form.carType})`,
        customerName: form.name,
        customerPhone: form.phone,
        vehicleType: form.carType,
        make: form.make,
        model: form.model
      };

      console.log('Submitting request data:', requestData);

      const response = await fetch('/api/service-requests/guest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit request. Please try again.');
      }

      setRequestDetails(data);
      setSuccess(true);
    } catch (err) {
      console.error('Form submission error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success && requestDetails) {
    return (
      <div className={styles.successContainer}>
        <div className={styles.successContent}>
          <div className={styles.successIcon}>
            <FaCheckCircle />
          </div>
          <h2>Request Submitted Successfully!</h2>
          <div className={styles.requestDetails}>
            <h3>Request Details</h3>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Request ID:</span>
                <span className={styles.detailValue}>{requestDetails.id}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Service Type:</span>
                <span className={styles.detailValue}>{requestDetails.serviceType}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Vehicle:</span>
                <span className={styles.detailValue}>{requestDetails.make} {requestDetails.model}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Location:</span>
                <span className={styles.detailValue}>{requestDetails.location.address}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Status:</span>
                <span className={styles.detailValue}>{requestDetails.status}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Submitted:</span>
                <span className={styles.detailValue}>
                  {new Date(requestDetails.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          <p className={styles.successMessage}>We've received your service request and will contact you shortly.</p>
          <p className={styles.successSubMessage}>A confirmation message has been sent to your WhatsApp.</p>
          <button className={styles.backButton} onClick={onBack}>Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.formTitle}>Emergency Request</h1>
        {error && (
          <div className={styles.errorContainer}>
            <FaInfoCircle className={styles.errorIcon} />
            <p>{error}</p>
          </div>
        )}

        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Contact Information</h3>
          <div className={styles.inputGroup}>
            <label htmlFor="name">
              <FaUser className={styles.inputIcon} />
              Full Name
            </label>
            <input
              name="name"
              id="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="phone">
              <FaPhone className={styles.inputIcon} />
              Phone Number
            </label>
            <input
              name="phone"
              id="phone"
              placeholder="Enter your phone number"
              value={form.phone}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="location">
              <FaMapMarkerAlt className={styles.inputIcon} />
              Location
            </label>
            <div className={styles.locationInput}>
              <input
                name="location"
                id="location"
                placeholder="Enter your location"
                value={form.location}
                onChange={handleChange}
                required
                className={styles.input}
              />
              <button
                type="button"
                className={styles.locationButton}
                onClick={handleLocation}
                disabled={locating}
              >
                {locating ? 'Locating...' : '📍'}
              </button>
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Vehicle Information</h3>
          <div className={styles.vehicleTypeContainer}>
            <label>Vehicle Type</label>
            <div className={styles.vehicleTypeGrid}>
              {vehicleTypes.map(type => (
                <button
                  key={type.id}
                  type="button"
                  className={`${styles.vehicleTypeButton} ${form.carType === type.id ? styles.selected : ''}`}
                  onClick={() => handleCarType(type.id)}
                  aria-label={type.label}
                >
                  {type.icon}
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {form.carType && (
            <>
              <div className={styles.inputGroup}>
                <label htmlFor="make">Car Make</label>
                <select
                  name="make"
                  id="make"
                  value={form.make}
                  onChange={handleMakeChange}
                  required
                  className={styles.select}
                >
                  <option value="">Select Make</option>
                  {carMakes.map(make => (
                    <option key={make.id} value={make.id}>{make.label}</option>
                  ))}
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="model">Car Model</label>
                <select
                  name="model"
                  id="model"
                  value={form.model}
                  onChange={handleChange}
                  required
                  className={styles.select}
                >
                  <option value="">Select Model</option>
                  {getModelsForMake(form.make).map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>

        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Service Details</h3>
          <div className={styles.serviceOptionsGrid}>
            {serviceOptions.map(service => (
              <button
                key={service.id}
                type="button"
                className={`${styles.serviceButton} ${form.service === service.id ? styles.selected : ''}`}
                onClick={() => handleService(service.id)}
              >
                {service.icon}
                <span>{service.label}</span>
              </button>
            ))}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="notes">Additional Notes</label>
            <textarea
              name="notes"
              id="notes"
              placeholder="Any additional information about your service request"
              value={form.notes}
              onChange={handleChange}
              className={styles.textarea}
              rows={4}
            />
          </div>
        </div>

        <div className={styles.formActions}>
          <button type="button" className={styles.backButton} onClick={onBack}>
            Back
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  );
} 