import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useSessions } from "../hooks/useSessions";
import CalendarGrid from "../components/CalendarGrid";
import SessionModal from "../components/SessionModal";
import { updateSession, deleteSession } from "../firebase/sessions";

export default function CalendarApp() {
  const { user, logout } = useAuth();
  const { sessions, loading } = useSessions();
  const [editingSession, setEditingSession] = useState(null);
  const [addMode, setAddMode] = useState(false);
  const [actionError, setActionError] = useState("");

  async function handleToggleComplete(session) {
    try {
      await updateSession(user.uid, session.id, { completed: !session.completed });
    } catch {
      setActionError("Could not update session. Check your connection and try again.");
    }
  }

  async function handleDelete(sessionId) {
    if (!window.confirm("Delete this session?")) return;
    try {
      await deleteSession(user.uid, sessionId);
    } catch {
      setActionError("Could not delete session. Check your connection and try again.");
    }
  }

  function handleCloseModal() {
    setAddMode(false);
    setEditingSession(null);
  }

  const showModal = addMode || editingSession !== null;

  return (
    <div className="app-layout">

      {/* Header */}
      <header className="app-header">
        <div className="app-header-inner">
          <div className="logo">
            <span className="logo-icon">&#128197;</span>
            <span className="logo-text">StudyCalendar</span>
          </div>
          <div className="header-right">
            <span className="header-email">{user.email}</span>
            <button className="btn btn-sm" onClick={logout}>Log out</button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="app-main">
        <div className="app-container">

          {/* Top bar */}
          <div className="app-topbar">
            <h2 className="week-title">This Week</h2>
            <button className="btn" onClick={() => setAddMode(true)}>
              + Add Session
            </button>
          </div>

          {/* Progress */}
          <div className="progress-section">
            {sessions.length === 0 ? (
              <p className="progress-label">No sessions yet</p>
            ) : (
              <>
                <div className="progress-label">
                  Weekly progress —{" "}
                  {sessions.filter((s) => s.completed).length} of {sessions.length} complete
                  {" "}({Math.round((sessions.filter((s) => s.completed).length / sessions.length) * 100)}%)
                </div>
                <div className="progress-bar-track">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${Math.round(
                        (sessions.filter((s) => s.completed).length / sessions.length) * 100
                      )}%`,
                    }}
                  />
                </div>
              </>
            )}
          </div>

          {/* Error banner */}
          {actionError && (
            <div className="action-error">
              {actionError}
              <button className="action-error-close" onClick={() => setActionError("")}>✕</button>
            </div>
          )}

          {/* Calendar grid */}
          {loading ? (
            <p className="loading-text">Loading sessions...</p>
          ) : (
            <CalendarGrid
              sessions={sessions}
              onEdit={setEditingSession}
              onDelete={handleDelete}
              onToggleComplete={handleToggleComplete}
            />
          )}

        </div>
      </main>

      {/* Modal — shown when adding or editing */}
      {showModal && (
        <SessionModal
          editingSession={editingSession}
          onClose={handleCloseModal}
        />
      )}

    </div>
  );
}
