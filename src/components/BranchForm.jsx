// BranchForm component - form for adding/editing branch information
import { useState, useEffect } from 'react';

/**
 * BranchForm - Controlled form component for branch data
 * @param {Object} props - Component props
 * @param {Object} props.initialData - Initial branch data for editing
 * @param {Function} props.onSubmit - Callback function when form is submitted
 * @param {Function} props.onCancel - Callback function when form is cancelled
 */
const BranchForm = ({ initialData = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    lat: '',
    lng: '',
    branchType: 'mall',
    openingDate: ''
  });

  const [errors, setErrors] = useState({});

  // Populate form if editing existing branch
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        address: initialData.address || '',
        lat: initialData.lat || '',
        lng: initialData.lng || '',
        branchType: initialData.branchType || 'mall',
        openingDate: initialData.openingDate || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Branch name is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    const lat = parseFloat(formData.lat);
    if (!formData.lat || isNaN(lat) || lat < -90 || lat > 90) {
      newErrors.lat = 'Valid latitude is required (-90 to 90)';
    }

    const lng = parseFloat(formData.lng);
    if (!formData.lng || isNaN(lng) || lng < -180 || lng > 180) {
      newErrors.lng = 'Valid longitude is required (-180 to 180)';
    }

    if (!formData.openingDate) {
      newErrors.openingDate = 'Opening date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      // Convert lat/lng to numbers before submitting
      const submitData = {
        ...formData,
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng)
      };
      onSubmit(submitData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="branch-form">
      <div className="form-group">
        <label htmlFor="name">Branch Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? 'error' : ''}
          placeholder="e.g., SM City Davao Branch"
        />
        {errors.name && <span className="error-text">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="address">Address *</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className={errors.address ? 'error' : ''}
          placeholder="e.g., SM City Davao, Ecoland, Davao City"
        />
        {errors.address && <span className="error-text">{errors.address}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="lat">Latitude *</label>
          <input
            type="number"
            id="lat"
            name="lat"
            value={formData.lat}
            onChange={handleChange}
            className={errors.lat ? 'error' : ''}
            placeholder="e.g., 7.0731"
            step="any"
          />
          {errors.lat && <span className="error-text">{errors.lat}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="lng">Longitude *</label>
          <input
            type="number"
            id="lng"
            name="lng"
            value={formData.lng}
            onChange={handleChange}
            className={errors.lng ? 'error' : ''}
            placeholder="e.g., 125.6128"
            step="any"
          />
          {errors.lng && <span className="error-text">{errors.lng}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="branchType">Branch Type *</label>
        <select
          id="branchType"
          name="branchType"
          value={formData.branchType}
          onChange={handleChange}
        >
          <option value="mall">Mall</option>
          <option value="roadside">Roadside</option>
          <option value="campus">Campus</option>
          <option value="commercial">Commercial</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="openingDate">Opening Date *</label>
        <input
          type="date"
          id="openingDate"
          name="openingDate"
          value={formData.openingDate}
          onChange={handleChange}
          className={errors.openingDate ? 'error' : ''}
        />
        {errors.openingDate && <span className="error-text">{errors.openingDate}</span>}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {initialData ? 'Update Branch' : 'Add Branch'}
        </button>
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default BranchForm;
