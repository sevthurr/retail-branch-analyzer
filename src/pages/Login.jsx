// Login page - handles user authentication
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../firebase/auth';
import { auth } from '../firebase/config';

/**
 * Login - Authentication page for user login and registration
 */
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (auth.currentUser) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!email || !password) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    // Login or register
    const result = isRegistering 
      ? await registerUser(email, password)
      : await loginUser(email, password);

    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-welcome">
        <div className="welcome-content">
          <h2>Retail Branch Analyzer</h2>
          <p>Location Performance Decision Support System</p>
          <p>Make data-driven decisions about branch performance, identify high-risk locations, and optimize your retail network.</p>
          
          <div className="welcome-features">
            <div className="feature-item">Performance Analytics Dashboard</div>
            <div className="feature-item">Risk Assessment & Monitoring</div>
            <div className="feature-item">Branch Location Insights</div>
            <div className="feature-item">Real-time Data Visualization</div>
          </div>
        </div>
      </div>

      <div className="login-form-wrapper">
        <form onSubmit={handleSubmit} className="login-form">
          <h2>{isRegistering ? 'Register' : 'Login'}</h2>

          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Processing...' : (isRegistering ? 'Register' : 'Login')}
          </button>

          <div className="login-footer">
            <button
              type="button"
              className="btn-link"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
              }}
            >
              {isRegistering 
                ? 'Already have an account? Login' 
                : "Don't have an account? Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
