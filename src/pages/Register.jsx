import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { registerUser } from "../utils/authService";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: null,
  });

  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("isAuthenticated") === "true") {
      navigate("/dashboard");
    }
  }, [navigate]);

  const validate = () => {
    if (!form.name.trim()) return "Full name is required";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Invalid email format";
    if (form.password.length < 6) return "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) return "Passwords do not match";
    return null;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, avatar: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) return setError(validationError);

    setLoading(true);
    setError("");

    // Simulate network delay, then register
    setTimeout(() => {
      const result = registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
        avatar: preview,
      });

      if (!result.success) {
        setError(result.error);
        setLoading(false);
        return;
      }

      // Registration successful — show verification animation
      setVerificationSent(true);
      setLoading(false);

      // Auto-login after short delay
      setTimeout(() => {
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("isAuthenticated", "true");
        navigate("/dashboard");
      }, 2000);
    }, 800);
  };

  return (
    <div className="auth-page">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="logo-section">
          <div className="logo-icon">✨</div>
          <h2>Create Account</h2>
          <p className="subtitle">Start your analytics journey</p>
        </div>

        {verificationSent ? (
          <div className="verify-msg">
            <p>✅ Account created successfully! Redirecting...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="avatar-upload">
              <label htmlFor="avatar">
                {preview ? <img src={preview} alt="avatar" /> : "Upload Avatar"}
              </label>
              <input
                type="file"
                id="avatar"
                hidden
                accept="image/*"
                onChange={handleAvatar}
              />
            </div>

            <div className="input-group">
              <label htmlFor="reg-name">Full Name</label>
              <input
                id="reg-name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label htmlFor="reg-email">Email</label>
              <input
                id="reg-email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                type="password"
                name="password"
                placeholder="Create a password (min 6 chars)"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label htmlFor="reg-confirm">Confirm Password</label>
              <input
                id="reg-confirm"
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={handleChange}
              />
            </div>

            {error && <p className="error-msg">{error}</p>}

            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? <span className="spinner" /> : "Create Account"}
            </button>
          </form>
        )}

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
