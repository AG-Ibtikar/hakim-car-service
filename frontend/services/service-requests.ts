import axios from 'axios';
import { getSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface ServiceRequest {
  id: string;
  serviceType: 'EMERGENCY' | 'TOW';
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  description?: string;
  customerName: string;
  customerPhone: string;
  vehicleType: string;
  make: string;
  model: string;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceRequestDto {
  serviceType: 'EMERGENCY' | 'TOW';
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  description?: string;
  customerName: string;
  customerPhone: string;
  vehicleType: string;
  make: string;
  model: string;
}

export const serviceRequestsApi = {
  async createServiceRequest(data: CreateServiceRequestDto): Promise<ServiceRequest> {
    const session = await getSession();
    if (!session?.user?.accessToken) {
      throw new Error('No authentication token found');
    }

    const response = await axios.post(`${API_URL}/service-requests`, data, {
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  async getServiceRequests(): Promise<ServiceRequest[]> {
    const session = await getSession();
    if (!session?.user?.accessToken) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get(`${API_URL}/service-requests/my-requests`, {
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });
    return response.data;
  },

  async getServiceRequest(id: string): Promise<ServiceRequest> {
    const session = await getSession();
    if (!session?.user?.accessToken) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get(`${API_URL}/service-requests/${id}`, {
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });
    return response.data;
  },

  async updateServiceRequest(id: string, data: Partial<ServiceRequest>): Promise<ServiceRequest> {
    const session = await getSession();
    if (!session?.user?.accessToken) {
      throw new Error('No authentication token found');
    }
    const response = await axios.patch(`${API_URL}/service-requests/${id}`, data, {
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  }
}; 