'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { Loader } from '@googlemaps/js-api-loader';
import LocationPicker from '../components/LocationPicker';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: string;
}

interface Location {
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface ServiceRequest {
  id: string;
  serviceType: string;
  description: string;
  preferredDate: string;
  preferredTime: string;
  vehicleId: string;
  location: Location;
  status: string;
  createdAt: string;
  vehicle?: Vehicle;
}

const serviceTypes = [
  {
    type: 'MAINTENANCE',
    label: 'Maintenance',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    type: 'REPAIR',
    label: 'Repair',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    type: 'DIAGNOSTIC',
    label: 'Diagnostic',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    type: 'CLEANING',
    label: 'Cleaning',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
      </svg>
    ),
  },
  {
    type: 'TIRE_SERVICE',
    label: 'Tire Service',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
  },
  {
    type: 'OTHER',
    label: 'Other',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
  },
];

const ServicesPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [mapLocation, setMapLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);
  const [filters, setFilters] = useState({
    date: '',
    vehicleId: '',
    status: '',
    serviceType: '',
  });
  const [formData, setFormData] = useState<Omit<ServiceRequest, 'id' | 'status' | 'createdAt'>>({
    serviceType: '',
    description: '',
    preferredDate: '',
    preferredTime: '',
    vehicleId: '',
    location: {
      address: '',
      city: '',
      state: '',
      zipCode: '',
    },
  });
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Initialize Google Maps API
  useEffect(() => {
    const initGoogleMaps = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        version: 'weekly',
        libraries: ['places'],
      });

      try {
        const google = await loader.load();
        const geocoder = new google.maps.Geocoder();
        setGeocoder(geocoder);
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initGoogleMaps();
  }, []);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setIsLoadingVehicles(true);
        setError('');
        
        const response = await fetch('/api/vehicles');
        const data = await response.json();
        
        if (response.status === 401) {
          router.push('/auth/login');
          return;
        }

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch vehicles');
        }

        setVehicles(data);
      } catch (err) {
        console.error('Error fetching vehicles:', err);
        setError(err instanceof Error ? err.message : 'Failed to load vehicles. Please try again.');
      } finally {
        setIsLoadingVehicles(false);
      }
    };

    const fetchServiceRequests = async () => {
      try {
        setIsLoadingRequests(true);
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('hakim_auth_token='))
          ?.split('=')[1];

        if (!token) {
          router.push('/auth/login');
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/service-requests`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          router.push('/auth/login');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch service requests');
        }

        const data = await response.json();
        setServiceRequests(data);
      } catch (err) {
        console.error('Error fetching service requests:', err);
        setError(err instanceof Error ? err.message : 'Failed to load service requests');
      } finally {
        setIsLoadingRequests(false);
      }
    };

    fetchVehicles();
    fetchServiceRequests();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('hakim_auth_token='))
        ?.split('=')[1];

      if (!token) {
        router.push('/auth/login');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/service-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.status === 401) {
        router.push('/auth/login');
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit service request');
      }

      setSuccess('Service request submitted successfully!');
      // Reset form and close popup
      setFormData({
        serviceType: '',
        description: '',
        preferredDate: '',
        preferredTime: '',
        vehicleId: '',
        location: {
          address: '',
          city: '',
          state: '',
          zipCode: '',
        },
      });
      setIsFormOpen(false);
      
      // Refresh service requests
      const requestsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/service-requests`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (requestsResponse.ok) {
        const requestsData = await requestsResponse.json();
        setServiceRequests(requestsData);
      }
    } catch (err) {
      console.error('Error submitting service request:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit service request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationChange = (field: keyof Location, value: string) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value,
      },
    }));
  };

  const getStatusClass = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'status-badge status-pending';
      case 'APPROVED':
        return 'status-badge status-approved';
      case 'REJECTED':
        return 'status-badge status-rejected';
      case 'COMPLETED':
        return 'status-badge status-completed';
      default:
        return 'status-badge status-rejected';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const filteredRequests = serviceRequests.filter(request => {
    return (
      (!filters.date || request.preferredDate === filters.date) &&
      (!filters.vehicleId || request.vehicleId === filters.vehicleId) &&
      (!filters.status || request.status === filters.status) &&
      (!filters.serviceType || request.serviceType === filters.serviceType)
    );
  });

  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      date: '',
      vehicleId: '',
      status: '',
      serviceType: '',
    });
  };

  const handleMapSelect = (location: { lat: number; lng: number }) => {
    setMapLocation(location);
    // Here you would typically use a geocoding service to get the address
    // For now, we'll just set a placeholder address
    handleLocationChange('address', 'Selected Location');
    setShowMap(false);
  };

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setMapLocation({ lat: latitude, lng: longitude });

          if (geocoder) {
            try {
              const response = await geocoder.geocode({
                location: { lat: latitude, lng: longitude },
              });

              if (response.results[0]) {
                const addressComponents = response.results[0].address_components;
                const address = response.results[0].formatted_address;
                
                // Extract city, state, and zip code from address components
                const city = addressComponents.find(
                  (component) => component.types.includes('locality')
                )?.long_name || '';
                
                const state = addressComponents.find(
                  (component) => component.types.includes('administrative_area_level_1')
                )?.long_name || '';
                
                const zipCode = addressComponents.find(
                  (component) => component.types.includes('postal_code')
                )?.long_name || '';

                handleLocationChange('address', address);
                handleLocationChange('city', city);
                handleLocationChange('state', state);
                handleLocationChange('zipCode', zipCode);
              }
            } catch (error) {
              console.error('Geocoding error:', error);
              setError('Failed to get address from location');
            }
          }
          setIsGettingLocation(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setError('Failed to get your location');
          setIsGettingLocation(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
      setIsGettingLocation(false);
    }
  };

  // Update the request card to include the service type icon
  const renderServiceTypeIcon = (type: string) => {
    return serviceTypes.find(service => service.type === type)?.icon || serviceTypes[5].icon;
  };

  return (
    <div className="min-h-screen bg-light">
      <div className="container section">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-primary">Service Requests</h2>
            <p className="mt-2 text-secondary">Manage and track your service requests</p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="btn btn-primary"
          >
            <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Service Request
          </button>
        </div>

        {/* Filters Section */}
        <div className="card mb-10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-primary">Filters</h3>
            <button
              onClick={clearFilters}
              className="text-secondary hover:text-primary text-sm font-medium flex items-center"
            >
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear Filters
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label htmlFor="filterDate" className="form-label">
                Preferred Date
              </label>
              <input
                type="date"
                id="filterDate"
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
                className="form-input"
              />
            </div>

            <div>
              <label htmlFor="filterVehicle" className="form-label">
                Vehicle
              </label>
              <select
                id="filterVehicle"
                value={filters.vehicleId}
                onChange={(e) => handleFilterChange('vehicleId', e.target.value)}
                className="form-input"
              >
                <option value="">All Vehicles</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="filterStatus" className="form-label">
                Status
              </label>
              <select
                id="filterStatus"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="form-input"
              >
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <div>
              <label htmlFor="filterService" className="form-label">
                Service Type
              </label>
              <select
                id="filterService"
                value={filters.serviceType}
                onChange={(e) => handleFilterChange('serviceType', e.target.value)}
                className="form-input"
              >
                <option value="">All Services</option>
                {serviceTypes.map((service) => (
                  <option key={service.type} value={service.type}>
                    {service.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-light border-2 border-yellow rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-primary">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-light border-2 border-yellow rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-primary">{success}</p>
              </div>
            </div>
          </div>
        )}

        {isLoadingRequests ? (
          <div className="grid gap-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-4 bg-light rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-light rounded"></div>
                  <div className="h-4 bg-light rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-10">
            {filteredRequests.length === 0 ? (
              <div className="card text-center py-12">
                <svg className="h-12 w-12 text-secondary mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-primary text-lg font-medium mb-2">No Service Requests Found</h3>
                <p className="text-secondary">Try adjusting your filters or create a new service request.</p>
              </div>
            ) : (
              filteredRequests.map((request) => (
                <div key={request.id} className="card group">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-4">
                      <div className="text-primary group-hover:text-black">
                        {renderServiceTypeIcon(request.serviceType)}
                      </div>
                      <div>
                        <h3 className="text-primary group-hover:text-black">
                          {request.serviceType.charAt(0) + request.serviceType.slice(1).toLowerCase()}
                        </h3>
                        <p className="mt-1 text-secondary group-hover:text-black">
                          {request.vehicle ? `${request.vehicle.year} ${request.vehicle.make} ${request.vehicle.model}` : 'Vehicle not found'}
                        </p>
                      </div>
                    </div>
                    <span className={getStatusClass(request.status)}>
                      {request.status}
                    </span>
                  </div>
                  <div className="mt-6">
                    <p className="text-primary group-hover:text-black">{request.description}</p>
                  </div>
                  <div className="mt-8 grid grid-cols-2 gap-10">
                    <div>
                      <p className="text-secondary font-medium group-hover:text-black">Preferred Date</p>
                      <p className="text-primary mt-2 group-hover:text-black">{formatDate(request.preferredDate)}</p>
                    </div>
                    <div>
                      <p className="text-secondary font-medium group-hover:text-black">Preferred Time</p>
                      <p className="text-primary mt-2 group-hover:text-black">{request.preferredTime}</p>
                    </div>
                    <div>
                      <p className="text-secondary font-medium group-hover:text-black">Location</p>
                      <p className="text-primary mt-2 group-hover:text-black">
                        {request.location.address}, {request.location.city}, {request.location.state} {request.location.zipCode}
                      </p>
                    </div>
                    <div>
                      <p className="text-secondary font-medium group-hover:text-black">Submitted</p>
                      <p className="text-primary mt-2 group-hover:text-black">{formatDate(request.createdAt)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Service Request Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-primary bg-opacity-75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-primary">New Service Request</h3>
                  <p className="mt-2 text-secondary">Fill out the form below to request a service</p>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-secondary hover:text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow rounded-full p-2 transition-all duration-300 hover:scale-110"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label className="form-label">Service Type</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                    {serviceTypes.map((service) => (
                      <button
                        key={service.type}
                        type="button"
                        onClick={() => setFormData({ ...formData, serviceType: service.type })}
                        className={`p-4 rounded-lg border-2 transition-all duration-300 flex flex-col items-center justify-center space-y-2 ${
                          formData.serviceType === service.type
                            ? 'border-primary-yellow bg-primary-yellow text-primary-black'
                            : 'border-secondary-gray hover:border-primary-yellow hover:bg-light'
                        }`}
                      >
                        <div className="text-current">{service.icon}</div>
                        <span className="text-sm font-medium">{service.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="form-input"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label htmlFor="preferredDate" className="form-label">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      id="preferredDate"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="preferredTime" className="form-label">
                      Preferred Time
                    </label>
                    <input
                      type="time"
                      id="preferredTime"
                      value={formData.preferredTime}
                      onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="vehicleId" className="form-label">
                    Vehicle
                  </label>
                  <select
                    id="vehicleId"
                    value={formData.vehicleId}
                    onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                    className="form-input"
                    required
                  >
                    <option value="">Select a vehicle</option>
                    {vehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-8">
                  <h4 className="form-label">Service Location</h4>
                  
                  <div>
                    <label htmlFor="address" className="form-label">
                      Address
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="address"
                        value={formData.location.address}
                        onChange={(e) => handleLocationChange('address', e.target.value)}
                        className="form-input pr-24"
                        required
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex space-x-2">
                        <button
                          type="button"
                          onClick={getCurrentLocation}
                          disabled={isGettingLocation}
                          className="text-secondary hover:text-primary disabled:opacity-50"
                          title="Use Current Location"
                        >
                          {isGettingLocation ? (
                            <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowMap(true)}
                          className="text-secondary hover:text-primary"
                          title="Select on Map"
                        >
                          <MapPinIcon className="h-6 w-6" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-8">
                    <div>
                      <label htmlFor="city" className="form-label">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        value={formData.location.city}
                        onChange={(e) => handleLocationChange('city', e.target.value)}
                        className="form-input"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="state" className="form-label">
                        State
                      </label>
                      <input
                        type="text"
                        id="state"
                        value={formData.location.state}
                        onChange={(e) => handleLocationChange('state', e.target.value)}
                        className="form-input"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="zipCode" className="form-label">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        value={formData.location.zipCode}
                        onChange={(e) => handleLocationChange('zipCode', e.target.value)}
                        className="form-input"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-8 border-t border-light">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      'Submit Request'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Map Modal */}
      {showMap && (
        <div className="fixed inset-0 bg-primary bg-opacity-75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-light flex justify-between items-center">
              <h3 className="text-primary">Select Location</h3>
              <button
                onClick={() => setShowMap(false)}
                className="text-secondary hover:text-primary"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="h-full">
              <LocationPicker
                onLocationSelect={({ lat, lng, address }) => {
                  setMapLocation({ lat, lng });
                  handleLocationChange('address', address);
                  setShowMap(false);
                }}
                onClose={() => setShowMap(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage; 