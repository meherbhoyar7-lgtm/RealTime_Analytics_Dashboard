import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authenticateUser, hasRegisteredUsers } from "../utils/authService";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("isAuthenticated") === "true") {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email.trim()) return setError("Email is required");
    if (!formData.password.trim()) return setError("Password is required");

    setLoading(true);
    setError("");

    // Simulate network delay, then authenticate
    setTimeout(() => {
      // Check if anyone has registered yet
      if (!hasRegisteredUsers()) {
        setError("No accounts exist yet. Please register first.");
        setLoading(false);
        return;
      }

      const result = authenticateUser(formData.email, formData.password);

      if (!result.success) {
        setError(result.error);
        setLoading(false);
        return;
      }

      // Login successful
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("isAuthenticated", "true");
      navigate("/dashboard");
    }, 800);
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-in-up">
        <div className="logo-section">
          <div className="logo-icon">🚀</div>
          <h2>Welcome Back</h2>
          <p className="subtitle">Sign in to your NexusBoard dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your registered email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : "Sign In"}
          </button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
