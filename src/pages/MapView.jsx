// MapView page - interactive map with branch markers and filters
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { subscribeToBranches, subscribeToAllPerformanceRecords } from '../firebase/db';
import { calculateRiskScore, getRiskLevel } from '../utils/riskScore';
import { formatCurrency, formatBranchType } from '../utils/format';
import { useNavigate } from 'react-router-dom';
import { HiMap, HiEye } from 'react-icons/hi';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Custom marker icons for different risk levels
const createCustomIcon = (riskLevel) => {
  const colors = {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#ef4444'
  };
  
  const color = colors[riskLevel] || '#14b8a6';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      width: 25px;
      height: 25px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [25, 25],
    iconAnchor: [12, 12],
  });
};

/**
 * FlyToLocation - Helper component to fly to a specific location
 */
const FlyToLocation = ({ center }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.flyTo(center, 14, { duration: 1 });
    }
  }, [center, map]);
  
  return null;
};

/**
 * MapView - Interactive map page with branch markers and filters
 */
const MapView = () => {
  const [branches, setBranches] = useState([]);
  const [performanceRecords, setPerformanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [mapCenter, setMapCenter] = useState([7.0731, 125.6128]); // Davao City default
  const navigate = useNavigate();

  useEffect(() => {
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

  // Calculate risk for each branch and filter
  const getBranchWithRisk = (branch) => {
    const branchRecords = performanceRecords.filter(r => r.branchId === branch.id);
    const latestRecord = branchRecords.sort((a, b) => b.month.localeCompare(a.month))[0];
    
    if (!latestRecord) {
      return { ...branch, riskLevel: 'low', riskScore: 0, latestSales: 0 };
    }
    
    const score = calculateRiskScore(latestRecord, branchRecords);
    const level = getRiskLevel(score);
    
    return {
      ...branch,
      riskLevel: level,
      riskScore: score,
      latestSales: latestRecord.sales
    };
  };

  // Apply filters
  const filteredBranches = branches
    .map(getBranchWithRisk)
    .filter(branch => {
      if (filterType !== 'all' && branch.branchType !== filterType) {
        return false;
      }
      if (filterRisk !== 'all' && branch.riskLevel !== filterRisk) {
        return false;
      }
      return true;
    });

  const handleBranchClick = (branch) => {
    setSelectedBranch(branch.id);
    setMapCenter([branch.lat, branch.lng]);
  };

  const handleViewDetails = (branchId) => {
    navigate(`/branch/${branchId}`);
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="page-container map-page">
      <div className="page-header">
        <h2>
          <HiMap size={32} />
          Branch Map View
        </h2>
      </div>

      <div className="map-layout">
        {/* Sidebar with filters and branch list */}
        <div className="map-sidebar">
          <div className="filters-section">
            <h3>Filters</h3>
            
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

            <div className="filter-group">
              <label>Risk Level:</label>
              <select value={filterRisk} onChange={(e) => setFilterRisk(e.target.value)}>
                <option value="all">All Levels</option>
                <option value="low">🟢 Low Risk</option>
                <option value="medium">🟡 Medium Risk</option>
                <option value="high">🔴 High Risk</option>
              </select>
            </div>

            <div className="filter-results">
              Showing {filteredBranches.length} of {branches.length}
            </div>
          </div>

          {/* Branch List */}
          <div className="branch-list">
            <h3>Branches</h3>
            {filteredBranches.length > 0 ? (
              <ul>
                {filteredBranches.map(branch => (
                  <li 
                    key={branch.id}
                    className={selectedBranch === branch.id ? 'selected' : ''}
                  >
                    <div 
                      className="branch-item"
                      onClick={() => handleBranchClick(branch)}
                    >
                      <div className="branch-name">
                        <span 
                          className="risk-indicator" 
                          style={{ 
                            backgroundColor: branch.riskLevel === 'low' ? '#10b981' : 
                                           branch.riskLevel === 'medium' ? '#f59e0b' : '#ef4444'
                          }}
                        ></span>
                        {branch.name}
                      </div>
                      <div className="branch-info">
                        <small>{formatBranchType(branch.branchType)}</small>
                        <small>Sales: {formatCurrency(branch.latestSales)}</small>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(branch.id);
                      }}
                      className="btn btn-sm btn-info"
                    >
                      <HiEye size={16} />
                      Details
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-data">No branches match the filters.</p>
            )}
          </div>
        </div>

        {/* Map Container */}
        <div className="map-container">
          {filteredBranches.length > 0 ? (
            <MapContainer
              center={mapCenter}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              <FlyToLocation center={mapCenter} />
              
              {filteredBranches.map(branch => (
                <Marker
                  key={branch.id}
                  position={[branch.lat, branch.lng]}
                  icon={createCustomIcon(branch.riskLevel)}
                >
                  <Popup>
                    <div className="map-popup">
                      <h4>{branch.name}</h4>
                      <p><strong>Type:</strong> {formatBranchType(branch.branchType)}</p>
                      <p><strong>Latest Sales:</strong> {formatCurrency(branch.latestSales)}</p>
                      <p>
                        <strong>Risk:</strong>{' '}
                        <span style={{
                          color: branch.riskLevel === 'low' ? '#10b981' : 
                                 branch.riskLevel === 'medium' ? '#f59e0b' : '#ef4444'
                        }}>
                          {branch.riskLevel.toUpperCase()} ({branch.riskScore})
                        </span>
                      </p>
                      <button
                        onClick={() => handleViewDetails(branch.id)}
                        className="btn btn-sm btn-primary"
                      >
                        <HiEye size={16} />
                        View Details
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          ) : (
            <div className="no-data">
              <p>No branches to display on the map.</p>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="map-legend">
        <h4>Risk Levels</h4>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#10b981' }}></span>
            Low Risk (0-33)
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#f59e0b' }}></span>
            Medium Risk (34-66)
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#ef4444' }}></span>
            High Risk (67-100)
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
