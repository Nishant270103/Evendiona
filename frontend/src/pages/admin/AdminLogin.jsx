import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/auth/admin-login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await response.json();
      if (response.ok && data.success && data.data?.token) {
        localStorage.setItem("adminToken", data.data.token);
        navigate("/admin");
      } else {
        setError(data.message || "Invalid admin credentials");
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        maxWidth: 340,
        margin: "60px auto",
        padding: 24,
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        background: "#fff",
        boxShadow: "0 2px 8px 0 rgba(0,0,0,0.04)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 18, fontWeight: 600, fontSize: 22 }}>
        Admin Login
      </h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="admin-email" style={{ fontWeight: 500 }}>
            Email
          </label>
          <input
            id="admin-email"
            type="email"
            required
            autoFocus
            value={email}
            onChange={e => {
              setEmail(e.target.value);
              setError("");
            }}
            style={{
              width: "100%",
              padding: "8px 10px",
              marginTop: 4,
              border: "1px solid #d1d5db",
              borderRadius: 4,
              fontSize: 15,
            }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="admin-password" style={{ fontWeight: 500 }}>
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            required
            value={password}
            onChange={e => {
              setPassword(e.target.value);
              setError("");
            }}
            style={{
              width: "100%",
              padding: "8px 10px",
              marginTop: 4,
              border: "1px solid #d1d5db",
              borderRadius: 4,
              fontSize: 15,
            }}
          />
        </div>
        {error && (
          <div style={{ color: "#dc2626", marginBottom: 12, fontSize: 14 }}>
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px 0",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            fontWeight: 600,
            fontSize: 16,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            transition: "background 0.2s",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
