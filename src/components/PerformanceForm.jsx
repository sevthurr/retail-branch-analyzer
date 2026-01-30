// PerformanceForm component - form for adding/editing performance records
import { useState, useEffect } from 'react';

/**
 * PerformanceForm - Controlled form component for performance record data
 * @param {Object} props - Component props
 * @param {string} props.branchId - ID of the branch this record belongs to
 * @param {Object} props.initialData - Initial record data for editing
 * @param {Function} props.onSubmit - Callback function when form is submitted
 * @param {Function} props.onCancel - Callback function when form is cancelled
 */
const PerformanceForm = ({ branchId, initialData = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    month: '',
    sales: '',
    rentCost: '',
    staffCount: '',
    operatingHours: '',
    complaints: '0',
    competitorCount: '',
    nearbyEstablishments: '',
    areaClass: 'mixed'
  });

  const [errors, setErrors] = useState({});

  // Populate form if editing existing record
  useEffect(() => {
    if (initialData) {
      setFormData({
        month: initialData.month || '',
        sales: initialData.sales || '',
        rentCost: initialData.rentCost || '',
        staffCount: initialData.staffCount || '',
        operatingHours: initialData.operatingHours || '',
        complaints: initialData.complaints || '0',
        competitorCount: initialData.competitorCount || '',
        nearbyEstablishments: Array.isArray(initialData.nearbyEstablishments) 
          ? initialData.nearbyEstablishments.join(', ') 
          : '',
        areaClass: initialData.areaClass || 'mixed'
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.month) {
      newErrors.month = 'Month is required';
    }

    if (!formData.sales || parseFloat(formData.sales) < 0) {
      newErrors.sales = 'Valid sales amount is required';
    }

    if (!formData.rentCost || parseFloat(formData.rentCost) < 0) {
      newErrors.rentCost = 'Valid rent cost is required';
    }

    if (!formData.staffCount || parseInt(formData.staffCount) < 1) {
      newErrors.staffCount = 'Staff count must be at least 1';
    }

    if (!formData.operatingHours || parseInt(formData.operatingHours) < 1 || parseInt(formData.operatingHours) > 24) {
      newErrors.operatingHours = 'Operating hours must be between 1 and 24';
    }

    if (!formData.competitorCount || parseInt(formData.competitorCount) < 0) {
      newErrors.competitorCount = 'Competitor count is required (0 or more)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      // Parse nearbyEstablishments string to array
      const establishments = formData.nearbyEstablishments
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);

      // Convert string inputs to appropriate types
      const submitData = {
        branchId,
        month: formData.month,
        sales: parseFloat(formData.sales),
        rentCost: parseFloat(formData.rentCost),
        staffCount: parseInt(formData.staffCount),
        operatingHours: parseInt(formData.operatingHours),
        complaints: parseInt(formData.complaints),
        competitorCount: parseInt(formData.competitorCount),
        nearbyEstablishments: establishments,
        areaClass: formData.areaClass
      };
      
      onSubmit(submitData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="performance-form">
      <div className="form-group">
        <label htmlFor="month">Month (YYYY-MM) *</label>
        <input
          type="month"
          id="month"
          name="month"
          value={formData.month}
          onChange={handleChange}
          className={errors.month ? 'error' : ''}
        />
        {errors.month && <span className="error-text">{errors.month}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="sales">Sales (₱) *</label>
          <input
            type="number"
            id="sales"
            name="sales"
            value={formData.sales}
            onChange={handleChange}
            className={errors.sales ? 'error' : ''}
            placeholder="e.g., 450000"
            min="0"
            step="0.01"
          />
          {errors.sales && <span className="error-text">{errors.sales}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="rentCost">Rent Cost (₱) *</label>
          <input
            type="number"
            id="rentCost"
            name="rentCost"
            value={formData.rentCost}
            onChange={handleChange}
            className={errors.rentCost ? 'error' : ''}
            placeholder="e.g., 120000"
            min="0"
            step="0.01"
          />
          {errors.rentCost && <span className="error-text">{errors.rentCost}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="staffCount">Staff Count *</label>
          <input
            type="number"
            id="staffCount"
            name="staffCount"
            value={formData.staffCount}
            onChange={handleChange}
            className={errors.staffCount ? 'error' : ''}
            placeholder="e.g., 8"
            min="1"
          />
          {errors.staffCount && <span className="error-text">{errors.staffCount}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="operatingHours">Operating Hours/Day *</label>
          <input
            type="number"
            id="operatingHours"
            name="operatingHours"
            value={formData.operatingHours}
            onChange={handleChange}
            className={errors.operatingHours ? 'error' : ''}
            placeholder="e.g., 12"
            min="1"
            max="24"
          />
          {errors.operatingHours && <span className="error-text">{errors.operatingHours}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="complaints">Customer Complaints</label>
          <input
            type="number"
            id="complaints"
            name="complaints"
            value={formData.complaints}
            onChange={handleChange}
            placeholder="e.g., 3"
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="competitorCount">Nearby Competitors *</label>
          <input
            type="number"
            id="competitorCount"
            name="competitorCount"
            value={formData.competitorCount}
            onChange={handleChange}
            className={errors.competitorCount ? 'error' : ''}
            placeholder="e.g., 3"
            min="0"
          />
          {errors.competitorCount && <span className="error-text">{errors.competitorCount}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="nearbyEstablishments">Nearby Establishments (comma-separated)</label>
        <input
          type="text"
          id="nearbyEstablishments"
          name="nearbyEstablishments"
          value={formData.nearbyEstablishments}
          onChange={handleChange}
          placeholder="e.g., mall, office, residential"
        />
        <small>Examples: mall, office, school, residential, terminal, hospital</small>
      </div>

      <div className="form-group">
        <label htmlFor="areaClass">Area Classification *</label>
        <select
          id="areaClass"
          name="areaClass"
          value={formData.areaClass}
          onChange={handleChange}
        >
          <option value="residential">Residential</option>
          <option value="mixed">Mixed Use</option>
          <option value="commercial">Commercial</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {initialData ? 'Update Record' : 'Add Record'}
        </button>
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default PerformanceForm;
