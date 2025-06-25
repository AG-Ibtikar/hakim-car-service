'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPinIcon } from '@heroicons/react/24/outline';

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
  user?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
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

const AdminRequestsPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [filters, setFilters] = useState({
    date: '',
    status: '',
    serviceType: '',
    search: '',
  });

  useEffect(() => {
    const fetchServiceRequests = async () => {
      try {
        setIsLoadingRequests(true);
        setError('');
        
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('hakim_auth_token='))
          ?.split('=')[1];

        if (!token) {
          router.push('/auth/login');
          return;
        }

        // First verify admin status
        const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-admin`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (verifyResponse.status === 401 || verifyResponse.status === 403) {
          router.push('/auth/login');
          return;
        }

        if (!verifyResponse.ok) {
          throw new Error('Not authorized to access admin features');
        }

        // Then fetch service requests
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/service-requests/admin/all`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 401 || response.status === 403) {
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

    fetchServiceRequests();
  }, [router]);

  const handleStatusChange = async (requestId: string, newStatus: string) => {
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

      // First verify admin status
      const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-admin`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (verifyResponse.status === 401 || verifyResponse.status === 403) {
        router.push('/auth/login');
        return;
      }

      if (!verifyResponse.ok) {
        throw new Error('Not authorized to update request status');
      }

      // Then update the request status
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/service-requests/admin/${requestId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update request status');
      }

      setSuccess('Request status updated successfully');
      
      // Update the local state
      setServiceRequests(prev => 
        prev.map(request => 
          request.id === requestId 
            ? { ...request, status: newStatus }
            : request
        )
      );
    } catch (err) {
      console.error('Error updating request status:', err);
      setError(err instanceof Error ? err.message : 'Failed to update request status');
    } finally {
      setLoading(false);
    }
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
    const matchesDate = !filters.date || request.preferredDate === filters.date;
    const matchesStatus = !filters.status || request.status === filters.status;
    const matchesServiceType = !filters.serviceType || request.serviceType === filters.serviceType;
    const matchesSearch = !filters.search || 
      request.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      request.user?.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      request.user?.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      request.vehicle?.make.toLowerCase().includes(filters.search.toLowerCase()) ||
      request.vehicle?.model.toLowerCase().includes(filters.search.toLowerCase());

    return matchesDate && matchesStatus && matchesServiceType && matchesSearch;
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
      status: '',
      serviceType: '',
      search: '',
    });
  };

  const renderServiceTypeIcon = (type: string) => {
    return serviceTypes.find(service => service.type === type)?.icon || serviceTypes[5].icon;
  };

  return (
    <div className="min-h-screen bg-light">
      <div className="container section">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-primary">Service Requests</h2>
            <p className="mt-2 text-secondary">Manage and track all service requests</p>
          </div>
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
              <label htmlFor="search" className="form-label">
                Search
              </label>
              <input
                type="text"
                id="search"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search by description, user, or vehicle..."
                className="form-input"
              />
            </div>

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
                <p className="text-secondary">Try adjusting your filters.</p>
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
                    <div className="flex items-center space-x-4">
                      <select
                        value={request.status}
                        onChange={(e) => handleStatusChange(request.id, e.target.value)}
                        className={`form-input py-1 px-2 text-sm ${getStatusClass(request.status)}`}
                        disabled={loading}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="text-primary group-hover:text-black">{request.description}</p>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-10">
                    <div>
                      <p className="text-secondary font-medium group-hover:text-black">Customer</p>
                      <p className="text-primary mt-2 group-hover:text-black">
                        {request.user?.name || 'Unknown'} ({request.user?.email || 'No email'})
                      </p>
                      {request.user?.phone && (
                        <p className="text-primary mt-1 group-hover:text-black">
                          {request.user.phone}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-secondary font-medium group-hover:text-black">Preferred Date & Time</p>
                      <p className="text-primary mt-2 group-hover:text-black">
                        {formatDate(request.preferredDate)} at {request.preferredTime}
                      </p>
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
    </div>
  );
};

export default AdminRequestsPage; 