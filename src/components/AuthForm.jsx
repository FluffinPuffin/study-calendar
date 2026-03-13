import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase/config";

export default function AuthForm() {
  const [mode, setMode] = useState("login"); // "login" or "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      if (mode === "signup") {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      // AuthContext's onAuthStateChanged will fire automatically after this,
      // updating the user state and triggering the redirect in App.jsx
    } catch (err) {
      setError(friendlyError(err.code));
    }
  }

  return (
    <div className="auth-card">
      <div className="logo">
        <span className="logo-icon">&#128197;</span>
        <span className="logo-text">StudyCalendar</span>
      </div>

      <h2>{mode === "login" ? "Welcome back" : "Create an account"}</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            minLength={6}
          />
        </div>

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" className="btn" style={{ width: "100%" }}>
          {mode === "login" ? "Log in" : "Sign up"}
        </button>
      </form>

      <p className="auth-toggle">
        {mode === "login" ? "Don't have an account? " : "Already have an account? "}
        <button
          className="link-btn"
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setError("");
          }}
        >
          {mode === "login" ? "Sign up" : "Log in"}
        </button>
      </p>
    </div>
  );
}

// Converts Firebase error codes into readable messages
function friendlyError(code) {
  switch (code) {
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    default:
      return "Something went wrong. Please try again.";
  }
}
