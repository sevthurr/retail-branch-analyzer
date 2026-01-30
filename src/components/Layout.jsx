// Layout component - provides consistent header and navigation structure
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logoutUser } from '../firebase/auth';
import { auth } from '../firebase/config';
import { HiLocationMarker, HiChartBar, HiOfficeBuilding, HiMap, HiLogout } from 'react-icons/hi';

/**
 * Layout - Main layout component with header, navigation, and content area
 * @param {Object} props - Component props
 * @param {React.Component} props.children - Page content to render
 */
const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = auth.currentUser;

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      navigate('/login');
    }
  };

  const isActive = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            <HiLocationMarker size={28} />
            Retail Branch Analyzer
          </h1>
          {user && (
            <div className="header-actions">
              <span className="user-email">{user.email}</span>
              <button onClick={handleLogout} className="btn btn-logout">
                <HiLogout size={18} />
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="main-container">
        {user && (
          <aside className="sidebar">
            <nav className="nav-menu">
              <Link to="/dashboard" className={isActive('/dashboard')}>
                <HiChartBar size={20} />
                Dashboard
              </Link>
              <Link to="/branches" className={isActive('/branches')}>
                <HiOfficeBuilding size={20} />
                Branches
              </Link>
              <Link to="/map" className={isActive('/map')}>
                <HiMap size={20} />
                Map View
              </Link>
            </nav>
          </aside>
        )}

        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
