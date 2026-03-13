import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useSessions } from "../hooks/useSessions";
import CalendarGrid from "../components/CalendarGrid";
import SessionModal from "../components/SessionModal";
import { updateSession, deleteSession } from "../firebase/sessions";
import StudyChart from "../components/StudyChart";
import ProfileModal from "../components/ProfileModal";
import { DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import FilterSelect from "../components/FilterSelect";

export default function CalendarApp() {
  const { user, logout } = useAuth();
  const { sessions, loading } = useSessions();
  const [editingSession, setEditingSession] = useState(null);
  const [addMode, setAddMode] = useState(false);
  const [actionError, setActionError] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [search, setSearch] = useState("");
  const [filterSubject, setFilterSubject] = useState("");

  // Unique subject names for the dropdown
  const subjects = [...new Set(sessions.map((s) => s.subject))].sort();

  // Weekly time total
  const totalMins = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
  const totalHours = Math.floor(totalMins / 60);
  const remainingMins = totalMins % 60;
  const totalLabel = totalHours > 0
    ? `${totalHours}h ${remainingMins > 0 ? `${remainingMins}m` : ""}`.trim()
    : `${remainingMins}m`;

  // Apply search + subject filter
  const visibleSessions = sessions.filter((s) => {
    const matchesSearch = s.subject.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = filterSubject === "" || s.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

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

  async function handleMarkAllComplete() {
    const incomplete = sessions.filter((s) => !s.completed);
    if (incomplete.length === 0) return;
    try {
      await Promise.all(incomplete.map((s) => updateSession(user.uid, s.id, { completed: true })));
    } catch {
      setActionError("Could not mark all complete. Check your connection and try again.");
    }
  }

  async function handleClearWeek() {
    if (!window.confirm("Delete all sessions this week? This cannot be undone.")) return;
    try {
      await Promise.all(sessions.map((s) => deleteSession(user.uid, s.id)));
    } catch {
      setActionError("Could not clear week. Check your connection and try again.");
    }
  }

  function handleCloseModal() {
    setAddMode(false);
    setEditingSession(null);
  }

  const showModal = addMode || editingSession !== null;

  // Require 8px movement before drag starts — prevents accidental drags on click
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  async function handleDragEnd({ active, over }) {
    if (!over) return;
    const session = sessions.find((s) => s.id === active.id);
    if (!session || session.day === over.id) return;
    try {
      await updateSession(user.uid, active.id, { day: over.id });
    } catch {
      setActionError("Could not move session. Check your connection and try again.");
    }
  }

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
            <button className="btn-profile" onClick={() => setShowProfile(true)}>
              {user.displayName || user.email}
            </button>
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

          {/* Bulk actions */}
          {sessions.length > 0 && (
            <div className="bulk-actions">
              <button className="btn btn-sm btn-ghost" onClick={handleMarkAllComplete}>
                Mark all complete
              </button>
              <button className="btn btn-sm btn-danger" onClick={handleClearWeek}>
                Clear week
              </button>
            </div>
          )}

          {/* Search + filter */}
          <div className="filter-bar">
            <input
              className="filter-input"
              type="text"
              placeholder="Search subjects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FilterSelect
              value={filterSubject}
              options={subjects}
              placeholder="All subjects"
              onChange={setFilterSubject}
            />
            {(search || filterSubject) && (
              <button
                className="filter-clear"
                onClick={() => { setSearch(""); setFilterSubject(""); }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Progress */}
          <div className="progress-section">
            {sessions.length === 0 ? (
              <p className="progress-label">No sessions yet</p>
            ) : (
              <>
                <div className="progress-stats">
                  <div className="progress-label">
                    Weekly progress —{" "}
                    {sessions.filter((s) => s.completed).length} of {sessions.length} complete
                    {" "}({Math.round((sessions.filter((s) => s.completed).length / sessions.length) * 100)}%)
                  </div>
                  <div className="progress-time">{totalLabel} this week</div>
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

          {/* Chart */}
          <StudyChart sessions={sessions} />

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
            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
              <CalendarGrid
                sessions={visibleSessions}
                onEdit={setEditingSession}
                onDelete={handleDelete}
                onToggleComplete={handleToggleComplete}
              />
            </DndContext>
          )}

        </div>
      </main>

      {/* Profile modal */}
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}

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
