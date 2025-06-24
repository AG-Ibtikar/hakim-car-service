import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import DashboardLayout from '../components/DashboardLayout';
import { vehiclesApi, Vehicle, CreateVehicleDto, VehicleType } from '../services/vehicles';
import { vehicleTypes, vehicleMakes } from '../data/vehicleData';
import styles from '../styles/MyVehicles.module.css';

export default function MyVehicles() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVehicle, setNewVehicle] = useState<CreateVehicleDto>({
    type: VehicleType.SEDAN,
    make: '',
    model: '',
    year: new Date().getFullYear(),
    licensePlate: '',
    vin: '',
  });

  // Get available makes for selected type
  const availableMakes = vehicleMakes[newVehicle.type] || [];
  
  // Get available models for selected make
  const availableModels = availableMakes.find(make => make.name === newVehicle.make)?.models || [];

  // Reset make and model when type changes
  const handleTypeChange = (type: VehicleType) => {
    setNewVehicle({
      ...newVehicle,
      type,
      make: '',
      model: '',
    });
  };

  // Reset model when make changes
  const handleMakeChange = (make: string) => {
    setNewVehicle({
      ...newVehicle,
      make,
      model: '',
    });
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

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

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const vehicle = await vehiclesApi.createVehicle(newVehicle);
      setVehicles([vehicle, ...vehicles]);
      setShowAddModal(false);
      setNewVehicle({
        type: VehicleType.SEDAN,
        make: '',
        model: '',
        year: new Date().getFullYear(),
        licensePlate: '',
        vin: '',
      });
    } catch (err) {
      setError('Failed to add vehicle. Please try again.');
      console.error('Error adding vehicle:', err);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) {
      return;
    }

    try {
      await vehiclesApi.deleteVehicle(id);
      setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
    } catch (err) {
      setError('Failed to delete vehicle. Please try again.');
      console.error('Error deleting vehicle:', err);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="My Vehicles">
        <div className={styles.container}>
          <div className={styles.loading}>Loading vehicles...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <Head>
        <title>My Vehicles | Hakim Car Service</title>
        <meta name="description" content="Manage your registered vehicles" />
      </Head>

      <DashboardLayout title="My Vehicles">
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>My Vehicles</h1>
            <button className={styles.addButton} onClick={() => setShowAddModal(true)}>
              <FaPlus /> Add Vehicle
            </button>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          {vehicles.length === 0 ? (
            <div className={styles.emptyState}>
              <p>You haven't added any vehicles yet.</p>
              <button className={styles.addButton} onClick={() => setShowAddModal(true)}>
                <FaPlus /> Add Your First Vehicle
              </button>
            </div>
          ) : (
            <div className={styles.vehicleGrid}>
              {vehicles.map((vehicle) => (
                <div key={vehicle.id} className={styles.vehicleCard}>
                  <div className={styles.vehicleInfo}>
                    <h3>{vehicle.make} {vehicle.model}</h3>
                    <p>Year: {vehicle.year}</p>
                    <p>License Plate: {vehicle.licensePlate}</p>
                    {vehicle.vin && <p>VIN: {vehicle.vin}</p>}
                  </div>
                  <div className={styles.vehicleActions}>
                    <button className={styles.editButton}>
                      <FaEdit /> Edit
                    </button>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => handleDeleteVehicle(vehicle.id)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showAddModal && (
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                  <h2>Add New Vehicle</h2>
                  <button 
                    className={styles.closeButton}
                    onClick={() => setShowAddModal(false)}
                    aria-label="Close modal"
                  >
                    <FaTimes />
                  </button>
                </div>
                <form onSubmit={handleAddVehicle}>
                  <div className={styles.formGroup}>
                    <label>Vehicle Type</label>
                    <div className={styles.vehicleTypeGrid}>
                      {vehicleTypes.map(({ type, icon: Icon, label }) => (
                        <button
                          key={type}
                          type="button"
                          className={`${styles.vehicleTypeButton} ${newVehicle.type === type ? styles.selected : ''}`}
                          onClick={() => handleTypeChange(type)}
                        >
                          <Icon size={24} />
                          <span>{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="make">Make</label>
                    <select
                      id="make"
                      value={newVehicle.make}
                      onChange={(e) => handleMakeChange(e.target.value)}
                      required
                      className={styles.select}
                      disabled={availableMakes.length === 0}
                    >
                      <option value="">Select Make</option>
                      {availableMakes.map((make) => (
                        <option key={make.name} value={make.name}>
                          {make.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="model">Model</label>
                    <select
                      id="model"
                      value={newVehicle.model}
                      onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                      required
                      className={styles.select}
                      disabled={availableModels.length === 0}
                    >
                      <option value="">Select Model</option>
                      {availableModels.map((model) => (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="year">Year</label>
                    <input
                      type="number"
                      id="year"
                      value={newVehicle.year}
                      onChange={(e) => setNewVehicle({ ...newVehicle, year: parseInt(e.target.value) })}
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="licensePlate">License Plate</label>
                    <input
                      type="text"
                      id="licensePlate"
                      value={newVehicle.licensePlate}
                      onChange={(e) => setNewVehicle({ ...newVehicle, licensePlate: e.target.value })}
                      placeholder="e.g., ABC123"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="vin">VIN (Optional)</label>
                    <input
                      type="text"
                      id="vin"
                      value={newVehicle.vin}
                      onChange={(e) => setNewVehicle({ ...newVehicle, vin: e.target.value })}
                      placeholder="17-character VIN"
                      maxLength={17}
                    />
                  </div>

                  <div className={styles.modalActions}>
                    <button 
                      type="button" 
                      onClick={() => setShowAddModal(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? 'Adding...' : 'Add Vehicle'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
} 