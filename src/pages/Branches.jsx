// Branches page - list, add, edit, and delete branches
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { subscribeToBranches, addBranch, updateBranch, deleteBranch } from '../firebase/db';
import { formatBranchType, formatDate } from '../utils/format';
import BranchForm from '../components/BranchForm';
import { HiOfficeBuilding, HiPlus, HiEye, HiPencil, HiTrash } from 'react-icons/hi';

/**
 * Branches - Branch management page with CRUD operations
 */
const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [filteredBranches, setFilteredBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = subscribeToBranches((data) => {
      setBranches(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Apply filters whenever branches, search, or filter changes
  useEffect(() => {
    let result = [...branches];

    // Search filter
    if (searchTerm) {
      result = result.filter(branch =>
        branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== 'all') {
      result = result.filter(branch => branch.branchType === filterType);
    }

    setFilteredBranches(result);
  }, [branches, searchTerm, filterType]);

  const handleAddBranch = () => {
    setEditingBranch(null);
    setShowForm(true);
  };

  const handleEditBranch = (branch) => {
    setEditingBranch(branch);
    setShowForm(true);
  };

  const handleDeleteBranch = async (branchId, branchName) => {
    if (window.confirm(`Are you sure you want to delete "${branchName}"? This will also delete all its performance records.`)) {
      const result = await deleteBranch(branchId);
      if (result.success) {
        alert('Branch deleted successfully');
      } else {
        alert('Error deleting branch: ' + result.error);
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    let result;
    
    if (editingBranch) {
      result = await updateBranch(editingBranch.id, formData);
    } else {
      result = await addBranch(formData);
    }

    if (result.success) {
      setShowForm(false);
      setEditingBranch(null);
      alert(editingBranch ? 'Branch updated successfully' : 'Branch added successfully');
    } else {
      alert('Error: ' + result.error);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingBranch(null);
  };

  const handleViewDetails = (branchId) => {
    navigate(`/branch/${branchId}`);
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Loading branches...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>
          <HiOfficeBuilding size={32} />
          Branches
        </h2>
        <button onClick={handleAddBranch} className="btn btn-primary">
          <HiPlus size={18} />
          Add Branch
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={handleFormCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingBranch ? 'Edit Branch' : 'Add New Branch'}</h3>
            <BranchForm
              initialData={editingBranch}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Branch Type:</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All Types</option>
            <option value="mall">Mall</option>
            <option value="roadside">Roadside</option>
            <option value="campus">Campus</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>

        <div className="filter-results">
          Showing {filteredBranches.length} of {branches.length} branches
        </div>
      </div>

      {/* Branches Table */}
      {filteredBranches.length > 0 ? (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Type</th>
                <th>Coordinates</th>
                <th>Opening Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBranches.map(branch => (
                <tr key={branch.id}>
                  <td>
                    <strong>{branch.name}</strong>
                  </td>
                  <td>{branch.address}</td>
                  <td>
                    <span className={`badge badge-${branch.branchType}`}>
                      {formatBranchType(branch.branchType)}
                    </span>
                  </td>
                  <td className="text-small">
                    {branch.lat.toFixed(4)}, {branch.lng.toFixed(4)}
                  </td>
                  <td>{formatDate(branch.openingDate)}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => handleViewDetails(branch.id)}
                        className="btn btn-sm btn-info"
                        title="View Details"
                      >
                        <HiEye size={16} />
                        View
                      </button>
                      <button
                        onClick={() => handleEditBranch(branch)}
                        className="btn btn-sm btn-secondary"
                        title="Edit"
                      >
                        <HiPencil size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteBranch(branch.id, branch.name)}
                        className="btn btn-sm btn-danger"
                        title="Delete"
                      >
                        <HiTrash size={16} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-data">
          <p>No branches found.</p>
          {branches.length === 0 && (
            <button onClick={handleAddBranch} className="btn btn-primary">
              <HiPlus size={18} />
              Add Your First Branch
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Branches;
