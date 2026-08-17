import { useState } from "react";

export default function AuthModal({ mode, onSwitchMode, onLogin, onRegister, onClose }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!username || !password) { setError("All fields required"); return; }
    setLoading(true);
    setError("");
    try {
      if (mode === "login") {
        await onLogin(username, password);
      } else {
        await onRegister(username, password);
      }
    } catch (e) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === "Enter") handleSubmit(); };

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose?.()}>
      <div className="modal">
        <div>
          <h2>{mode === "login" ? "Welcome back" : "Create account"}</h2>
          <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 4 }}>
            {mode === "login" ? "Sign in to access your notes" : "Start taking notes"}
          </p>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <div className="field">
          <label>Username</label>
          <input
            type="text"
            placeholder="your_username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={handleKey}
            autoFocus
          />
        </div>

        <div className="field">
          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={handleKey}
          />
        </div>

        <button
          className="btn-primary"
          onClick={handleSubmit}
          disabled={loading}
          style={{ opacity: loading ? 0.6 : 1 }}
        >
          {loading ? "..." : mode === "login" ? "Sign in" : "Create account"}
        </button>

        <p className="footer-link">
          {mode === "login" ? "No account?" : "Have an account?"}{" "}
          <button onClick={() => onSwitchMode(mode === "login" ? "register" : "login")}>
            {mode === "login" ? "Register" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
