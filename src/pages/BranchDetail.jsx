// BranchDetail page - detailed view of a single branch with performance records and analytics
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBranch, subscribeToPerformanceRecords, addPerformanceRecord, updatePerformanceRecord, deletePerformanceRecord } from '../firebase/db';
import { calculateProfit, calculateRentRatio, calculateSalesPerStaff, getSalesTrendData } from '../utils/analytics';
import { calculateRiskScore, getRiskLevel, getRiskFactors } from '../utils/riskScore';
import { formatCurrency, formatDate, formatBranchType, formatAreaClass, formatNumber } from '../utils/format';
import RiskBadge from '../components/RiskBadge';
import PerformanceForm from '../components/PerformanceForm';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { HiArrowLeft, HiPlus, HiPencil, HiTrash } from 'react-icons/hi';

/**
 * BranchDetail - Detailed branch page with performance records and analytics
 */
const BranchDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [branch, setBranch] = useState(null);
  const [performanceRecords, setPerformanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  useEffect(() => {
    // Get branch data
    const fetchBranch = async () => {
      const result = await getBranch(id);
      if (result.success) {
        setBranch(result.data);
      } else {
        alert('Branch not found');
        navigate('/branches');
      }
      setLoading(false);
    };

    fetchBranch();

    // Subscribe to performance records
    const unsubscribe = subscribeToPerformanceRecords(id, (data) => {
      setPerformanceRecords(data);
    });

    return () => unsubscribe();
  }, [id, navigate]);

  // Calculate analytics from latest record
  const latestRecord = performanceRecords.length > 0 ? performanceRecords[0] : null;
  const riskScore = latestRecord ? calculateRiskScore(latestRecord, performanceRecords) : 0;
  const riskLevel = getRiskLevel(riskScore);
  const riskFactors = latestRecord ? getRiskFactors(latestRecord, performanceRecords) : [];

  const profit = latestRecord ? calculateProfit(latestRecord.sales, latestRecord.rentCost) : 0;
  const rentRatio = latestRecord ? calculateRentRatio(latestRecord.sales, latestRecord.rentCost) : 0;
  const salesPerStaff = latestRecord ? calculateSalesPerStaff(latestRecord.sales, latestRecord.staffCount) : 0;

  // Prepare chart data
  const salesTrendData = getSalesTrendData(performanceRecords);

  const handleAddRecord = () => {
    setEditingRecord(null);
    setShowForm(true);
  };

  const handleEditRecord = (record) => {
    setEditingRecord(record);
    setShowForm(true);
  };

  const handleDeleteRecord = async (recordId, month) => {
    if (window.confirm(`Delete performance record for ${month}?`)) {
      const result = await deletePerformanceRecord(recordId);
      if (result.success) {
        alert('Record deleted successfully');
      } else {
        alert('Error deleting record: ' + result.error);
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    let result;
    
    if (editingRecord) {
      result = await updatePerformanceRecord(editingRecord.id, formData);
    } else {
      result = await addPerformanceRecord(formData);
    }

    if (result.success) {
      setShowForm(false);
      setEditingRecord(null);
      alert(editingRecord ? 'Record updated successfully' : 'Record added successfully');
    } else {
      alert('Error: ' + result.error);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingRecord(null);
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Loading branch details...</div>
      </div>
    );
  }

  if (!branch) {
    return (
      <div className="page-container">
        <div className="error">Branch not found</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <button onClick={() => navigate('/branches')} className="btn btn-secondary">
            <HiArrowLeft size={18} />
            Back to Branches
          </button>
          <h2>{branch.name}</h2>
        </div>
        <RiskBadge level={riskLevel} score={riskScore} />
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={handleFormCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingRecord ? 'Edit Performance Record' : 'Add Performance Record'}</h3>
            <PerformanceForm
              branchId={id}
              initialData={editingRecord}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </div>
        </div>
      )}

      {/* Branch Info Card */}
      <div className="detail-section">
        <h3>Branch Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <label>Address:</label>
            <span>{branch.address}</span>
          </div>
          <div className="info-item">
            <label>Type:</label>
            <span>{formatBranchType(branch.branchType)}</span>
          </div>
          <div className="info-item">
            <label>Coordinates:</label>
            <span>{branch.lat.toFixed(4)}, {branch.lng.toFixed(4)}</span>
          </div>
          <div className="info-item">
            <label>Opening Date:</label>
            <span>{formatDate(branch.openingDate)}</span>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      {latestRecord && (
        <div className="detail-section">
          <h3>Latest Performance Metrics ({latestRecord.month})</h3>
          <div className="metrics-grid">
            <div className="metric-card">
              <label>Profit</label>
              <div className={`metric-value ${profit < 0 ? 'negative' : 'positive'}`}>
                {formatCurrency(profit)}
              </div>
            </div>
            <div className="metric-card">
              <label>Rent Ratio</label>
              <div className={`metric-value ${rentRatio > 0.35 ? 'warning' : ''}`}>
                {(rentRatio * 100).toFixed(1)}%
              </div>
            </div>
            <div className="metric-card">
              <label>Sales per Staff</label>
              <div className="metric-value">
                {formatCurrency(salesPerStaff)}
              </div>
            </div>
            <div className="metric-card">
              <label>Competitors</label>
              <div className={`metric-value ${latestRecord.competitorCount >= 5 ? 'warning' : ''}`}>
                {latestRecord.competitorCount}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Risk Factors */}
      {riskFactors.length > 0 && (
        <div className="detail-section">
          <h3>Risk Factors</h3>
          <div className="risk-factors">
            {riskFactors.map((factor, index) => (
              <div key={index} className="risk-factor-item">
                <div className="factor-header">
                  <strong>{factor.factor}</strong>
                  <span className="factor-points">+{factor.points} points</span>
                </div>
                <div className="factor-description">{factor.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sales Trend Chart */}
      {salesTrendData.length > 0 && (
        <div className="detail-section">
          <h3>Sales Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#14b8a6" 
                strokeWidth={2}
                name="Sales (₱)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Performance Records */}
      <div className="detail-section">
        <div className="section-header">
          <h3>Performance Records</h3>
          <button onClick={handleAddRecord} className="btn btn-primary">
            <HiPlus size={18} />
            Add Record
          </button>
        </div>

        {performanceRecords.length > 0 ? (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Sales</th>
                  <th>Rent</th>
                  <th>Profit</th>
                  <th>Staff</th>
                  <th>Complaints</th>
                  <th>Competitors</th>
                  <th>Area Class</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {performanceRecords.map(record => {
                  const recordProfit = calculateProfit(record.sales, record.rentCost);
                  return (
                    <tr key={record.id}>
                      <td><strong>{record.month}</strong></td>
                      <td>{formatCurrency(record.sales)}</td>
                      <td>{formatCurrency(record.rentCost)}</td>
                      <td className={recordProfit < 0 ? 'negative' : 'positive'}>
                        {formatCurrency(recordProfit)}
                      </td>
                      <td>{record.staffCount}</td>
                      <td>{record.complaints || 0}</td>
                      <td>{record.competitorCount}</td>
                      <td>{formatAreaClass(record.areaClass)}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => handleEditRecord(record)}
                            className="btn btn-sm btn-secondary"
                          >
                            <HiPencil size={16} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteRecord(record.id, record.month)}
                            className="btn btn-sm btn-danger"
                          >
                            <HiTrash size={16} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-data">
            <p>No performance records yet.</p>
            <button onClick={handleAddRecord} className="btn btn-primary">
              <HiPlus size={18} />
              Add First Record
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BranchDetail;
