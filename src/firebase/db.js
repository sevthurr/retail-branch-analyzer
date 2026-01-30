// Firestore database helper functions
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';

// ============ BRANCHES ============

/**
 * Add a new branch to Firestore
 * @param {Object} branchData - Branch data object
 * @returns {Promise} - Added branch with ID
 */
export const addBranch = async (branchData) => {
  try {
    const docRef = await addDoc(collection(db, 'branches'), {
      ...branchData,
      createdAt: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding branch:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update an existing branch
 * @param {string} branchId - Branch document ID
 * @param {Object} branchData - Updated branch data
 * @returns {Promise} - Update result
 */
export const updateBranch = async (branchId, branchData) => {
  try {
    const branchRef = doc(db, 'branches', branchId);
    await updateDoc(branchRef, branchData);
    return { success: true };
  } catch (error) {
    console.error('Error updating branch:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete a branch (and optionally its performance records)
 * @param {string} branchId - Branch document ID
 * @returns {Promise} - Delete result
 */
export const deleteBranch = async (branchId) => {
  try {
    // Delete all performance records for this branch first
    const perfQuery = query(collection(db, 'performanceRecords'), where('branchId', '==', branchId));
    const perfSnapshot = await getDocs(perfQuery);
    
    const deletePromises = perfSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    // Delete the branch
    await deleteDoc(doc(db, 'branches', branchId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting branch:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get a single branch by ID
 * @param {string} branchId - Branch document ID
 * @returns {Promise} - Branch data with ID
 */
export const getBranch = async (branchId) => {
  try {
    const branchDoc = await getDoc(doc(db, 'branches', branchId));
    if (branchDoc.exists()) {
      return { success: true, data: { id: branchDoc.id, ...branchDoc.data() } };
    } else {
      return { success: false, error: 'Branch not found' };
    }
  } catch (error) {
    console.error('Error getting branch:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Subscribe to all branches with real-time updates
 * @param {function} callback - Callback function to receive branches array
 * @returns {function} - Unsubscribe function
 */
export const subscribeToBranches = (callback) => {
  const q = query(collection(db, 'branches'), orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const branches = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(branches);
  }, (error) => {
    console.error('Error subscribing to branches:', error);
    callback([]);
  });
};

// ============ PERFORMANCE RECORDS ============

/**
 * Add a performance record for a branch
 * @param {Object} recordData - Performance record data (must include branchId)
 * @returns {Promise} - Added record with ID
 */
export const addPerformanceRecord = async (recordData) => {
  try {
    const docRef = await addDoc(collection(db, 'performanceRecords'), {
      ...recordData,
      createdAt: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding performance record:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update a performance record
 * @param {string} recordId - Record document ID
 * @param {Object} recordData - Updated record data
 * @returns {Promise} - Update result
 */
export const updatePerformanceRecord = async (recordId, recordData) => {
  try {
    const recordRef = doc(db, 'performanceRecords', recordId);
    await updateDoc(recordRef, recordData);
    return { success: true };
  } catch (error) {
    console.error('Error updating performance record:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete a performance record
 * @param {string} recordId - Record document ID
 * @returns {Promise} - Delete result
 */
export const deletePerformanceRecord = async (recordId) => {
  try {
    await deleteDoc(doc(db, 'performanceRecords', recordId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting performance record:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Subscribe to performance records for a specific branch
 * @param {string} branchId - Branch ID to filter by
 * @param {function} callback - Callback function to receive records array
 * @returns {function} - Unsubscribe function
 */
export const subscribeToPerformanceRecords = (branchId, callback) => {
  const q = query(
    collection(db, 'performanceRecords'),
    where('branchId', '==', branchId),
    orderBy('month', 'desc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const records = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(records);
  }, (error) => {
    console.error('Error subscribing to performance records:', error);
    callback([]);
  });
};

/**
 * Get all performance records for all branches
 * @returns {Promise} - All performance records
 */
export const getAllPerformanceRecords = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'performanceRecords'));
    const records = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return { success: true, data: records };
  } catch (error) {
    console.error('Error getting performance records:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Subscribe to all performance records with real-time updates
 * @param {function} callback - Callback function to receive all records
 * @returns {function} - Unsubscribe function
 */
export const subscribeToAllPerformanceRecords = (callback) => {
  const q = query(collection(db, 'performanceRecords'), orderBy('month', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const records = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(records);
  }, (error) => {
    console.error('Error subscribing to all performance records:', error);
    callback([]);
  });
};

// ============ DEMO DATA ============

/**
 * Add demo data for testing and presentation
 * Creates 5 branches with 3 months of performance data each
 * @returns {Promise} - Result of demo data creation
 */
export const addDemoData = async () => {
  try {
    // Demo branches data
    const demoBranches = [
      {
        name: "SM City Davao Branch",
        address: "SM City Davao, Ecoland, Davao City",
        lat: 7.0731,
        lng: 125.6128,
        branchType: "mall",
        openingDate: "2023-01-15"
      },
      {
        name: "Matina Town Square Branch",
        address: "Matina Town Square, Davao City",
        lat: 7.0644,
        lng: 125.6091,
        branchType: "commercial",
        openingDate: "2023-03-20"
      },
      {
        name: "UP Mindanao Branch",
        address: "University of the Philippines Mindanao, Davao City",
        lat: 7.0658,
        lng: 125.5947,
        branchType: "campus",
        openingDate: "2023-05-10"
      },
      {
        name: "J.P. Laurel Ave Branch",
        address: "J.P. Laurel Avenue, Bajada, Davao City",
        lat: 7.0744,
        lng: 125.6091,
        branchType: "roadside",
        openingDate: "2023-02-01"
      },
      {
        name: "Abreeza Mall Branch",
        address: "Abreeza Mall, J.P. Laurel Ave, Davao City",
        lat: 7.0719,
        lng: 125.6161,
        branchType: "mall",
        openingDate: "2023-04-15"
      }
    ];

    // Add branches and get their IDs
    const branchIds = [];
    for (const branch of demoBranches) {
      const result = await addBranch(branch);
      if (result.success) {
        branchIds.push(result.id);
      }
    }

    // Demo performance data templates for each branch
    const performanceTemplates = [
      // SM City Davao - good performance
      [
        { month: "2025-11", sales: 450000, rentCost: 120000, staffCount: 8, operatingHours: 12, complaints: 3, competitorCount: 3, nearbyEstablishments: ["mall", "office", "residential"], areaClass: "commercial" },
        { month: "2025-12", sales: 520000, rentCost: 120000, staffCount: 8, operatingHours: 12, complaints: 2, competitorCount: 3, nearbyEstablishments: ["mall", "office", "residential"], areaClass: "commercial" },
        { month: "2026-01", sales: 580000, rentCost: 120000, staffCount: 9, operatingHours: 12, complaints: 1, competitorCount: 3, nearbyEstablishments: ["mall", "office", "residential"], areaClass: "commercial" }
      ],
      // Matina Town Square - moderate performance
      [
        { month: "2025-11", sales: 280000, rentCost: 85000, staffCount: 6, operatingHours: 10, complaints: 5, competitorCount: 4, nearbyEstablishments: ["commercial", "residential"], areaClass: "mixed" },
        { month: "2025-12", sales: 310000, rentCost: 85000, staffCount: 6, operatingHours: 10, complaints: 4, competitorCount: 4, nearbyEstablishments: ["commercial", "residential"], areaClass: "mixed" },
        { month: "2026-01", sales: 295000, rentCost: 85000, staffCount: 6, operatingHours: 10, complaints: 6, competitorCount: 5, nearbyEstablishments: ["commercial", "residential"], areaClass: "mixed" }
      ],
      // UP Mindanao - seasonal performance
      [
        { month: "2025-11", sales: 180000, rentCost: 45000, staffCount: 4, operatingHours: 9, complaints: 2, competitorCount: 2, nearbyEstablishments: ["school", "dormitory"], areaClass: "residential" },
        { month: "2025-12", sales: 95000, rentCost: 45000, staffCount: 4, operatingHours: 9, complaints: 1, competitorCount: 2, nearbyEstablishments: ["school", "dormitory"], areaClass: "residential" },
        { month: "2026-01", sales: 210000, rentCost: 45000, staffCount: 5, operatingHours: 9, complaints: 3, competitorCount: 2, nearbyEstablishments: ["school", "dormitory"], areaClass: "residential" }
      ],
      // J.P. Laurel Ave - struggling branch (high risk)
      [
        { month: "2025-11", sales: 150000, rentCost: 95000, staffCount: 5, operatingHours: 10, complaints: 12, competitorCount: 7, nearbyEstablishments: ["office", "commercial"], areaClass: "commercial" },
        { month: "2025-12", sales: 135000, rentCost: 95000, staffCount: 5, operatingHours: 10, complaints: 15, competitorCount: 8, nearbyEstablishments: ["office", "commercial"], areaClass: "commercial" },
        { month: "2026-01", sales: 120000, rentCost: 95000, staffCount: 4, operatingHours: 10, complaints: 18, competitorCount: 8, nearbyEstablishments: ["office", "commercial"], areaClass: "commercial" }
      ],
      // Abreeza Mall - excellent performance
      [
        { month: "2025-11", sales: 550000, rentCost: 135000, staffCount: 10, operatingHours: 12, complaints: 2, competitorCount: 2, nearbyEstablishments: ["mall", "office", "hotel"], areaClass: "commercial" },
        { month: "2025-12", sales: 620000, rentCost: 135000, staffCount: 10, operatingHours: 12, complaints: 1, competitorCount: 2, nearbyEstablishments: ["mall", "office", "hotel"], areaClass: "commercial" },
        { month: "2026-01", sales: 680000, rentCost: 135000, staffCount: 11, operatingHours: 12, complaints: 1, competitorCount: 2, nearbyEstablishments: ["mall", "office", "hotel"], areaClass: "commercial" }
      ]
    ];

    // Add performance records for each branch
    for (let i = 0; i < branchIds.length; i++) {
      const branchId = branchIds[i];
      const records = performanceTemplates[i];
      
      for (const record of records) {
        await addPerformanceRecord({
          branchId,
          ...record
        });
      }
    }

    return { success: true, message: `Added ${branchIds.length} demo branches with performance data` };
  } catch (error) {
    console.error('Error adding demo data:', error);
    return { success: false, error: error.message };
  }
};
