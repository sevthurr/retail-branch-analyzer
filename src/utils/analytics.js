// Analytics functions for computing business metrics

/**
 * Calculate profit from sales and rent cost
 * @param {number} sales - Total sales
 * @param {number} rentCost - Rent cost
 * @returns {number} - Profit (sales - rentCost)
 */
export const calculateProfit = (sales, rentCost) => {
  return (sales || 0) - (rentCost || 0);
};

/**
 * Calculate rent ratio (rent cost as percentage of sales)
 * @param {number} sales - Total sales
 * @param {number} rentCost - Rent cost
 * @returns {number} - Rent ratio (0 to 1+)
 */
export const calculateRentRatio = (sales, rentCost) => {
  const safeSales = Math.max(sales || 0, 1);
  return (rentCost || 0) / safeSales;
};

/**
 * Calculate sales per staff member
 * @param {number} sales - Total sales
 * @param {number} staffCount - Number of staff
 * @returns {number} - Sales per staff
 */
export const calculateSalesPerStaff = (sales, staffCount) => {
  const safeStaffCount = Math.max(staffCount || 0, 1);
  return (sales || 0) / safeStaffCount;
};

/**
 * Get the latest performance record from an array
 * @param {Array} records - Array of performance records with 'month' field
 * @returns {Object|null} - Latest record or null
 */
export const getLatestRecord = (records) => {
  if (!records || records.length === 0) return null;
  
  // Sort by month descending and return first
  const sorted = [...records].sort((a, b) => {
    return b.month.localeCompare(a.month);
  });
  
  return sorted[0];
};

/**
 * Check if sales is decreasing for the last 3 months
 * @param {Array} records - Array of performance records sorted by month desc
 * @returns {boolean} - True if sales decreased for 3 consecutive months
 */
export const isSalesDecreasing = (records) => {
  if (!records || records.length < 3) return false;
  
  // Sort by month descending to get most recent first
  const sorted = [...records].sort((a, b) => b.month.localeCompare(a.month));
  
  // Check if first month < second month < third month (decreasing trend)
  return sorted[0].sales < sorted[1].sales && sorted[1].sales < sorted[2].sales;
};

/**
 * Calculate average profit across all branches
 * @param {Array} branches - Array of branches
 * @param {Array} allRecords - Array of all performance records
 * @returns {number} - Average profit across all branches
 */
export const calculateAverageProfit = (branches, allRecords) => {
  if (!branches || branches.length === 0) return 0;
  
  let totalProfit = 0;
  let branchCount = 0;
  
  branches.forEach(branch => {
    const branchRecords = allRecords.filter(r => r.branchId === branch.id);
    const latestRecord = getLatestRecord(branchRecords);
    
    if (latestRecord) {
      totalProfit += calculateProfit(latestRecord.sales, latestRecord.rentCost);
      branchCount++;
    }
  });
  
  return branchCount > 0 ? totalProfit / branchCount : 0;
};

/**
 * Calculate average profit by branch type
 * @param {Array} branches - Array of branches
 * @param {Array} allRecords - Array of all performance records
 * @returns {Array} - Array of {branchType, avgProfit} objects
 */
export const calculateProfitByBranchType = (branches, allRecords) => {
  if (!branches || branches.length === 0) return [];
  
  const branchTypes = ['mall', 'roadside', 'campus', 'commercial'];
  const result = [];
  
  branchTypes.forEach(type => {
    const typeBranches = branches.filter(b => b.branchType === type);
    
    if (typeBranches.length > 0) {
      let totalProfit = 0;
      let count = 0;
      
      typeBranches.forEach(branch => {
        const branchRecords = allRecords.filter(r => r.branchId === branch.id);
        const latestRecord = getLatestRecord(branchRecords);
        
        if (latestRecord) {
          totalProfit += calculateProfit(latestRecord.sales, latestRecord.rentCost);
          count++;
        }
      });
      
      const avgProfit = count > 0 ? totalProfit / count : 0;
      
      result.push({
        branchType: type,
        avgProfit: avgProfit,
        count: typeBranches.length
      });
    }
  });
  
  return result;
};

/**
 * Find the best performing branch type by average profit
 * @param {Array} branches - Array of branches
 * @param {Array} allRecords - Array of all performance records
 * @returns {string} - Best branch type name or 'N/A'
 */
export const getBestBranchType = (branches, allRecords) => {
  const profitByType = calculateProfitByBranchType(branches, allRecords);
  
  if (profitByType.length === 0) return 'N/A';
  
  const best = profitByType.reduce((max, current) => {
    return current.avgProfit > max.avgProfit ? current : max;
  }, profitByType[0]);
  
  const typeNames = {
    mall: 'Mall',
    roadside: 'Roadside',
    campus: 'Campus',
    commercial: 'Commercial'
  };
  
  return typeNames[best.branchType] || best.branchType;
};

/**
 * Get sales trend data for a specific branch
 * @param {Array} records - Performance records for a branch (sorted by month)
 * @returns {Array} - Array of {month, sales} objects for charting
 */
export const getSalesTrendData = (records) => {
  if (!records || records.length === 0) return [];
  
  // Sort by month ascending for trend chart
  const sorted = [...records].sort((a, b) => a.month.localeCompare(b.month));
  
  return sorted.map(record => ({
    month: record.month,
    sales: record.sales || 0
  }));
};
