import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import DashboardLayout from '../../components/DashboardLayout';
import VehicleList from '../../components/VehicleList';
import { vehiclesApi, Vehicle, CreateVehicleDto } from '../../services/vehicles';

export default function Vehicles() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    fetchVehicles();
  }, [router]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const data = await vehiclesApi.getVehicles();
      setVehicles(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch vehicles. Please try again later.');
      console.error('Error fetching vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = async (vehicle: Omit<Vehicle, 'id'>) => {
    try {
      const newVehicle = await vehiclesApi.createVehicle(vehicle);
      setVehicles([newVehicle, ...vehicles]);
    } catch (err) {
      setError('Failed to add vehicle. Please try again.');
      console.error('Error adding vehicle:', err);
    }
  };

  const handleEditVehicle = async (id: string, vehicle: Omit<Vehicle, 'id'>) => {
    try {
      const updatedVehicle = await vehiclesApi.updateVehicle(id, vehicle);
      setVehicles(vehicles.map(v => v.id === id ? updatedVehicle : v));
    } catch (err) {
      setError('Failed to update vehicle. Please try again.');
      console.error('Error updating vehicle:', err);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    try {
      await vehiclesApi.deleteVehicle(id);
      setVehicles(vehicles.filter(v => v.id !== id));
    } catch (err) {
      setError('Failed to delete vehicle. Please try again.');
      console.error('Error deleting vehicle:', err);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="My Vehicles">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading vehicles...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <Head>
        <title>My Vehicles | Car Service</title>
      </Head>

      <DashboardLayout title="My Vehicles">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}
        <VehicleList
          vehicles={vehicles}
          onAdd={handleAddVehicle}
          onEdit={handleEditVehicle}
          onDelete={handleDeleteVehicle}
        />
      </DashboardLayout>
    </>
  );
} 