import { useState, useEffect } from 'react';
import { FaUser, FaPhone, FaEnvelope, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import styles from '../styles/UserProfile.module.css';

interface UserProfileProps {
  user: {
    firstName: string;
    lastName: string;
    email?: string;
    phoneNumber: string;
  };
  onUpdate: (data: any) => Promise<void>;
}

export default function UserProfile({ user, onUpdate }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email || '',
    phoneNumber: user.phoneNumber,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await onUpdate(formData);
      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Profile Information</h2>
        <button
          className={styles.editButton}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? <FaTimes /> : <FaEdit />}
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label>
            <FaUser className={styles.icon} />
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            disabled={!isEditing}
            required
          />
        </div>

        <div className={styles.field}>
          <label>
            <FaUser className={styles.icon} />
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            disabled={!isEditing}
            required
          />
        </div>

        <div className={styles.field}>
          <label>
            <FaPhone className={styles.icon} />
            Phone Number
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            disabled={!isEditing}
            required
          />
        </div>

        <div className={styles.field}>
          <label>
            <FaEnvelope className={styles.icon} />
            Email (Optional)
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        {isEditing && (
          <button type="submit" className={styles.saveButton}>
            <FaSave />
            Save Changes
          </button>
        )}
      </form>
    </div>
  );
} 