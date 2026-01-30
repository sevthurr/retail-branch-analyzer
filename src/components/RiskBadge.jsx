// RiskBadge component - displays risk level with appropriate styling
import { getRiskColor } from '../utils/format';

/**
 * RiskBadge - Visual indicator for risk level
 * @param {Object} props - Component props
 * @param {string} props.level - Risk level: 'low', 'medium', or 'high'
 * @param {number} props.score - Optional risk score to display
 */
const RiskBadge = ({ level, score }) => {
  const color = getRiskColor(level);
  
  const labels = {
    low: 'Low Risk',
    medium: 'Medium Risk',
    high: 'High Risk'
  };

  const label = labels[level] || 'Unknown';

  return (
    <span 
      className="risk-badge" 
      style={{ 
        backgroundColor: color,
        color: 'white',
        padding: '0.5rem 1rem',
        borderRadius: '20px',
        fontSize: '0.875rem',
        fontWeight: '700',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}
    >
      {label} {score !== undefined && `(${score})`}
    </span>
  );
};

export default RiskBadge;
