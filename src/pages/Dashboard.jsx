// Dashboard page - overview and analytics summary
import { useState, useEffect } from 'react';
import { subscribeToBranches, subscribeToAllPerformanceRecords, addDemoData } from '../firebase/db';
import { calculateAverageProfit, calculateProfitByBranchType, getBestBranchType } from '../utils/analytics';
import { calculateRiskScore, getRiskLevel } from '../utils/riskScore';
import { formatCurrency, formatBranchType } from '../utils/format';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { HiChartBar, HiPlus } from 'react-icons/hi';

/**
 * Dashboard - Main dashboard page with summary cards and charts
 */
const Dashboard = () => {
  const [branches, setBranches] = useState([]);
  const [performanceRecords, setPerformanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingDemo, setAddingDemo] = useState(false);

  useEffect(() => {
    // Subscribe to branches and performance records
    const unsubBranches = subscribeToBranches((data) => {
      setBranches(data);
      setLoading(false);
    });

    const unsubRecords = subscribeToAllPerformanceRecords((data) => {
      setPerformanceRecords(data);
    });

    return () => {
      unsubBranches();
      unsubRecords();
    };
  }, []);

  // Calculate metrics
  const totalBranches = branches.length;
  const avgProfit = calculateAverageProfit(branches, performanceRecords);
  const bestType = getBestBranchType(branches, performanceRecords);

  // Count high-risk branches
  const highRiskCount = branches.filter(branch => {
    const branchRecords = performanceRecords.filter(r => r.branchId === branch.id);
    const latestRecord = branchRecords.sort((a, b) => b.month.localeCompare(a.month))[0];
    if (!latestRecord) return false;
    const score = calculateRiskScore(latestRecord, branchRecords);
    const level = getRiskLevel(score);
    return level === 'high';
  }).length;

  // Prepare chart data
  const chartData = calculateProfitByBranchType(branches, performanceRecords).map(item => ({
    branchType: formatBranchType(item.branchType),
    avgProfit: Math.round(item.avgProfit),
    count: item.count
  }));

  const handleAddDemoData = async () => {
    if (window.confirm('This will add 5 demo branches with 3 months of data each. Continue?')) {
      setAddingDemo(true);
      const result = await addDemoData();
      setAddingDemo(false);
      
      if (result.success) {
        alert(result.message);
      } else {
        alert('Error adding demo data: ' + result.error);
      }
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>
          <HiChartBar size={32} />
          Dashboard
        </h2>
        <button 
          onClick={handleAddDemoData} 
          className="btn btn-secondary"
          disabled={addingDemo}
        >
          <HiPlus size={18} />
          {addingDemo ? 'Adding...' : 'Add Demo Data'}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="dashboard-cards">
        <div className="card">
          <div className="card-header">Total Branches</div>
          <div className="card-value">{totalBranches}</div>
          <div className="card-label">Active locations</div>
        </div>

        <div className="card">
          <div className="card-header">Average Profit</div>
          <div className="card-value">{formatCurrency(avgProfit)}</div>
          <div className="card-label">Per branch (latest month)</div>
        </div>

        <div className="card card-danger">
          <div className="card-header">High Risk Branches</div>
          <div className="card-value">{highRiskCount}</div>
          <div className="card-label">Require attention</div>
        </div>

        <div className="card card-success">
          <div className="card-header">Best Branch Type</div>
          <div className="card-value">{bestType}</div>
          <div className="card-label">Highest avg profit</div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="dashboard-chart">
        <h3>Average Profit by Branch Type</h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="branchType" />
              <YAxis />
              <Tooltip 
                formatter={(value) => formatCurrency(value)}
                labelStyle={{ color: '#333' }}
              />
              <Legend />
              <Bar dataKey="avgProfit" fill="#14b8a6" name="Average Profit (₱)" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="no-data">
            <p>No data available. Add some branches and performance records to see charts.</p>
            <button onClick={handleAddDemoData} className="btn btn-primary" disabled={addingDemo}>
              <HiPlus size={18} />
              {addingDemo ? 'Adding...' : 'Add Demo Data'}
            </button>
          </div>
        )}
      </div>

      {/* Recent Activity or Insights */}
      <div className="dashboard-insights">
        <h3>Quick Insights</h3>
        <ul>
          <li>You have {totalBranches} branches being monitored</li>
          {highRiskCount > 0 && (
            <li className="warning">{highRiskCount} branch(es) are at high risk and need immediate attention</li>
          )}
          {chartData.length > 0 && (
            <li>{bestType} branches show the best average profitability</li>
          )}
          {totalBranches === 0 && (
            <li>Get started by adding branches or loading demo data</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
