// Risk scoring functions for branch performance evaluation

import { calculateProfit, calculateRentRatio, isSalesDecreasing } from './analytics';

/**
 * Calculate risk score for a branch based on its latest performance
 * 
 * Scoring rules (0-100 scale):
 * - Profit < 0: +35 points
 * - Rent ratio > 0.35: +20 points
 * - Competitor count >= 5: +15 points
 * - Complaints >= 10: +10 points
 * - Sales decreasing for 3 months: +20 points
 * 
 * @param {Object} latestRecord - Latest performance record
 * @param {Array} allRecords - All performance records for trend analysis
 * @returns {number} - Risk score (0-100)
 */
export const calculateRiskScore = (latestRecord, allRecords = []) => {
  if (!latestRecord) return 0;
  
  let score = 0;
  
  // Rule 1: Negative profit
  const profit = calculateProfit(latestRecord.sales, latestRecord.rentCost);
  if (profit < 0) {
    score += 35;
  }
  
  // Rule 2: High rent ratio (rent > 35% of sales)
  const rentRatio = calculateRentRatio(latestRecord.sales, latestRecord.rentCost);
  if (rentRatio > 0.35) {
    score += 20;
  }
  
  // Rule 3: High competition
  const competitorCount = latestRecord.competitorCount || 0;
  if (competitorCount >= 5) {
    score += 15;
  }
  
  // Rule 4: High complaints
  const complaints = latestRecord.complaints || 0;
  if (complaints >= 10) {
    score += 10;
  }
  
  // Rule 5: Sales decreasing trend
  if (allRecords.length >= 3 && isSalesDecreasing(allRecords)) {
    score += 20;
  }
  
  // Clamp score between 0 and 100
  return Math.min(Math.max(score, 0), 100);
};

/**
 * Convert risk score to risk level category
 * @param {number} score - Risk score (0-100)
 * @returns {string} - Risk level: 'low', 'medium', or 'high'
 */
export const getRiskLevel = (score) => {
  if (score >= 67) return 'high';
  if (score >= 34) return 'medium';
  return 'low';
};

/**
 * Get risk level label with emoji
 * @param {string} level - Risk level ('low', 'medium', 'high')
 * @returns {string} - Formatted risk level
 */
export const getRiskLevelLabel = (level) => {
  const labels = {
    low: '🟢 Low Risk',
    medium: '🟡 Medium Risk',
    high: '🔴 High Risk'
  };
  return labels[level] || 'Unknown';
};

/**
 * Get detailed risk factors for a branch
 * Returns an array of active risk factors with their contributions
 * @param {Object} latestRecord - Latest performance record
 * @param {Array} allRecords - All performance records for trend analysis
 * @returns {Array} - Array of {factor, points, description} objects
 */
export const getRiskFactors = (latestRecord, allRecords = []) => {
  if (!latestRecord) return [];
  
  const factors = [];
  
  // Check each risk factor
  const profit = calculateProfit(latestRecord.sales, latestRecord.rentCost);
  if (profit < 0) {
    factors.push({
      factor: 'Negative Profit',
      points: 35,
      description: `Losing ₱${Math.abs(profit).toLocaleString()} per month`
    });
  }
  
  const rentRatio = calculateRentRatio(latestRecord.sales, latestRecord.rentCost);
  if (rentRatio > 0.35) {
    factors.push({
      factor: 'High Rent Ratio',
      points: 20,
      description: `Rent is ${(rentRatio * 100).toFixed(1)}% of sales (threshold: 35%)`
    });
  }
  
  const competitorCount = latestRecord.competitorCount || 0;
  if (competitorCount >= 5) {
    factors.push({
      factor: 'High Competition',
      points: 15,
      description: `${competitorCount} competitors nearby`
    });
  }
  
  const complaints = latestRecord.complaints || 0;
  if (complaints >= 10) {
    factors.push({
      factor: 'High Complaints',
      points: 10,
      description: `${complaints} customer complaints this month`
    });
  }
  
  if (allRecords.length >= 3 && isSalesDecreasing(allRecords)) {
    factors.push({
      factor: 'Declining Sales',
      points: 20,
      description: 'Sales decreased for 3 consecutive months'
    });
  }
  
  return factors;
};

/**
 * Calculate risk distribution across all branches
 * @param {Array} branches - Array of branches
 * @param {Array} allRecords - Array of all performance records
 * @returns {Object} - {low: count, medium: count, high: count}
 */
export const getRiskDistribution = (branches, allRecords) => {
  const distribution = { low: 0, medium: 0, high: 0 };
  
  if (!branches || branches.length === 0) return distribution;
  
  branches.forEach(branch => {
    const branchRecords = allRecords.filter(r => r.branchId === branch.id);
    const latestRecord = branchRecords.sort((a, b) => b.month.localeCompare(a.month))[0];
    
    if (latestRecord) {
      const score = calculateRiskScore(latestRecord, branchRecords);
      const level = getRiskLevel(score);
      distribution[level]++;
    }
  });
  
  return distribution;
};
