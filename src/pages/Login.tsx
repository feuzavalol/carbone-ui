import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

type Mode = "login" | "register";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
        await login(email, password);
        navigate("/home");
    } catch (err) {
        setError("L'email ou le mot de passe sont incorrects");
    } finally {
        setLoading(false);
    }
  };

  const resetFeedback = () => {
    setError(null);
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    resetFeedback();
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.tabs}>
          <button
            type="button"
            onClick={() => switchMode("login")}
            style={mode === "login" ? styles.tabActive : styles.tab}
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => switchMode("register")}
            style={mode === "register" ? styles.tabActive : styles.tab}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {mode === "register" && (
            <label style={styles.label}>
              Name
              <input
                style={styles.input}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
          )}

          <label style={styles.label}>
            Email
            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </label>

          <label style={styles.label}>
            Password
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              minLength={8}
            />
          </label>

          <button type="submit" disabled={loading} style={styles.submit}>
            {loading ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
          </button>
        </form>

        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f5f5",
    fontFamily: "system-ui, sans-serif",
  },
  card: {
    width: 360,
    background: "#fff",
    borderRadius: 8,
    padding: 24,
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
  },
  tabs: {
    display: "flex",
    marginBottom: 20,
    borderBottom: "1px solid #e0e0e0",
  },
  tab: {
    flex: 1,
    padding: "8px 0",
    background: "none",
    border: "none",
    borderBottom: "2px solid transparent",
    cursor: "pointer",
    color: "#888",
    fontSize: 14,
  },
  tabActive: {
    flex: 1,
    padding: "8px 0",
    background: "none",
    border: "none",
    borderBottom: "2px solid #2563eb",
    cursor: "pointer",
    color: "#2563eb",
    fontWeight: 600,
    fontSize: 14,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  label: {
    display: "flex",
    flexDirection: "column",
    fontSize: 13,
    color: "#333",
    gap: 4,
  },
  input: {
    padding: "8px 10px",
    fontSize: 14,
    border: "1px solid #ccc",
    borderRadius: 4,
  },
  submit: {
    marginTop: 8,
    padding: "10px 0",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  error: {
    marginTop: 16,
    color: "#dc2626",
    fontSize: 13,
  },
  result: {
    marginTop: 16,
    paddingTop: 16,
    borderTop: "1px solid #e0e0e0",
  },
  resultLabel: {
    fontSize: 13,
    color: "#333",
    marginBottom: 6,
  },
  tokenBox: {
    width: "100%",
    fontSize: 11,
    fontFamily: "monospace",
    padding: 8,
    border: "1px solid #ccc",
    borderRadius: 4,
    resize: "none",
    boxSizing: "border-box",
  },
  copyButton: {
    marginTop: 8,
    padding: "6px 12px",
    fontSize: 13,
    background: "#f0f0f0",
    border: "1px solid #ccc",
    borderRadius: 4,
    cursor: "pointer",
  },
};