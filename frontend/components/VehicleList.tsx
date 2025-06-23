import { useState } from 'react';
import { FaCar, FaPlus, FaEdit, FaTrash, FaCamera } from 'react-icons/fa';
import styles from '../styles/VehicleList.module.css';
import { Vehicle, CreateVehicleDto, VehicleType } from '../services/vehicles';

interface VehicleListProps {
  vehicles: Vehicle[];
  onAdd: (vehicle: CreateVehicleDto) => Promise<void>;
  onEdit: (id: string, vehicle: CreateVehicleDto) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function VehicleList({ vehicles, onAdd, onEdit, onDelete }: VehicleListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateVehicleDto>({
    type: 'Sedan',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    licensePlate: '',
    vin: '',
    vinImage: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value) : value
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError('');

    try {
      // Create a FormData object
      const formData = new FormData();
      formData.append('file', file);

      // Upload the image
      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      setFormData(prev => ({
        ...prev,
        vinImage: data.url
      }));
    } catch (err) {
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Create a copy of formData and remove empty vinImage
      const submitData = {
        ...formData,
        vinImage: formData.vinImage || undefined
      };

      if (editingId) {
        await onEdit(editingId, submitData);
        setSuccess('Vehicle updated successfully');
      } else {
        await onAdd(submitData);
        setSuccess('Vehicle added successfully');
      }
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save vehicle');
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingId(vehicle.id);
    setFormData({
      type: vehicle.type,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      licensePlate: vehicle.licensePlate,
      vin: vehicle.vin,
      vinImage: vehicle.vinImage
    });
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await onDelete(id);
        setSuccess('Vehicle deleted successfully');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete vehicle');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'Sedan',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      licensePlate: '',
      vin: '',
      vinImage: ''
    });
    setEditingId(null);
    setIsAdding(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>My Vehicles</h2>
        <button
          className={styles.addButton}
          onClick={() => setIsAdding(!isAdding)}
        >
          <FaPlus />
          {isAdding ? 'Cancel' : 'Add Vehicle'}
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      {isAdding && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label>Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Truck">Truck</option>
                <option value="Van">Van</option>
                <option value="Sports Car">Sports Car</option>
                <option value="Luxury">Luxury</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
              </select>
            </div>

            <div className={styles.field}>
              <label>Make</label>
              <input
                type="text"
                name="make"
                value={formData.make}
                onChange={handleChange}
                required
                placeholder="e.g., Toyota"
              />
            </div>

            <div className={styles.field}>
              <label>Model</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
                placeholder="e.g., Camry"
              />
            </div>

            <div className={styles.field}>
              <label>Year</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                min="1900"
                max={new Date().getFullYear() + 1}
              />
            </div>

            <div className={styles.field}>
              <label>License Plate</label>
              <input
                type="text"
                name="licensePlate"
                value={formData.licensePlate}
                onChange={handleChange}
                required
                placeholder="e.g., ABC123"
              />
            </div>

            <div className={styles.field}>
              <label>VIN</label>
              <input
                type="text"
                name="vin"
                value={formData.vin}
                onChange={handleChange}
                placeholder="Vehicle Identification Number"
              />
            </div>

            <div className={styles.field}>
              <label>VIN Image</label>
              <div className={styles.imageUpload}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className={styles.fileInput}
                  id="vinImage"
                />
                <button
                  type="button"
                  className={styles.uploadButton}
                  onClick={() => document.getElementById('vinImage')?.click()}
                  disabled={isUploading}
                >
                  <FaCamera />
                  {isUploading ? 'Uploading...' : 'Upload VIN Image'}
                </button>
                {formData.vinImage && (
                  <div className={styles.imagePreview}>
                    <img src={formData.vinImage} alt="VIN" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.submitButton}>
              {editingId ? 'Update Vehicle' : 'Add Vehicle'}
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={resetForm}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className={styles.vehicleList}>
        {vehicles.length === 0 ? (
          <p className={styles.emptyMessage}>No vehicles added yet</p>
        ) : (
          vehicles.map(vehicle => (
            <div key={vehicle.id} className={styles.vehicleCard}>
              <div className={styles.vehicleInfo}>
                <FaCar className={styles.vehicleIcon} />
                <div>
                  <h3>{vehicle.year} {vehicle.make} {vehicle.model}</h3>
                  <p>License Plate: {vehicle.licensePlate}</p>
                  <p>VIN: {vehicle.vin}</p>
                  {vehicle.vinImage && (
                    <div className={styles.vehicleImage}>
                      <img src={vehicle.vinImage} alt="VIN" />
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.vehicleActions}>
                <button
                  className={styles.editButton}
                  onClick={() => handleEdit(vehicle)}
                >
                  <FaEdit />
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(vehicle.id)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 