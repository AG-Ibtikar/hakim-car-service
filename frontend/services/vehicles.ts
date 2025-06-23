import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export enum VehicleType {
  SEDAN = 'Sedan',
  SUV = 'SUV',
  TRUCK = 'Truck',
  VAN = 'Van',
  SPORTS_CAR = 'Sports Car',
  LUXURY = 'Luxury',
  HYBRID = 'Hybrid',
  ELECTRIC = 'Electric'
}

export interface Vehicle {
  id: string;
  type: VehicleType;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin?: string;
  vinImage?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVehicleDto {
  type: VehicleType;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin?: string;
  vinImage?: string;
}

export const vehiclesApi = {
  async getVehicles(): Promise<Vehicle[]> {
    const token = Cookies.get('hakim_auth_token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await axios.get(`${API_URL}/vehicles`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async createVehicle(data: CreateVehicleDto): Promise<Vehicle> {
    const token = Cookies.get('hakim_auth_token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await axios.post(`${API_URL}/vehicles`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  async updateVehicle(id: string, data: CreateVehicleDto): Promise<Vehicle> {
    const token = Cookies.get('hakim_auth_token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await axios.put(`${API_URL}/vehicles/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  async deleteVehicle(id: string): Promise<void> {
    const token = Cookies.get('hakim_auth_token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    await axios.delete(`${API_URL}/vehicles/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
}; 