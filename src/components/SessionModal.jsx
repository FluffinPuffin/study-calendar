import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { addSession, updateSession } from "../firebase/sessions";
import { upsertSubject } from "../firebase/subjects";
import { useSubjects } from "../hooks/useSubjects";
import TimeSelect from "./TimeSelect";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = ["00", "15", "30", "45"];

const PRESET_COLORS = [
  "#4f46e5", // indigo
  "#0ea5e9", // sky blue
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#14b8a6", // teal
];

const EMPTY_FORM = {
  subject: "",
  day: "Monday",
  startTime: "09:00",
  duration: 60,
  notes: "",
  color: "#4f46e5",
};

export default function SessionModal({ editingSession, onClose }) {
  const { user } = useAuth();
  const subjects = useSubjects();
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Pre-populate form when editing an existing session
  useEffect(() => {
    if (editingSession) {
      setForm({
        subject:   editingSession.subject   || "",
        day:       editingSession.day       || "Monday",
        startTime: editingSession.startTime || "09:00",
        duration:  editingSession.duration  || 60,
        notes:     editingSession.notes     || "",
        color:     editingSession.color     || "#4f46e5",
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [editingSession]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "duration" ? Number(value) : value,
    }));
  }

  // When a subject chip is clicked, fill in the name and its saved color
  function handleSubjectChip(subject) {
    setForm((prev) => ({ ...prev, subject: subject.name, color: subject.color }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.subject.trim()) {
      setError("Subject is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      // Save the subject→color mapping so it appears as a chip next time
      await upsertSubject(user.uid, form.subject, form.color);

      if (editingSession) {
        await updateSession(user.uid, editingSession.id, form);
      } else {
        await addSession(user.uid, form);
      }
      onClose();
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>

        <div className="modal-header">
          <h3>{editingSession ? "Edit Session" : "Add Session"}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">

          {/* Subject */}
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              id="subject"
              name="subject"
              type="text"
              value={form.subject}
              onChange={handleChange}
              placeholder="e.g. Calculus"
              required
            />
            {/* Previously used subjects as clickable chips */}
            {subjects.length > 0 && (
              <div className="subject-chips">
                {subjects.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className="subject-chip"
                    style={{ borderColor: s.color, color: s.color }}
                    onClick={() => handleSubjectChip(s)}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Day */}
          <div className="form-group">
            <label>Day</label>
            <TimeSelect
              value={form.day}
              options={DAYS}
              onChange={(d) => setForm((prev) => ({ ...prev, day: d }))}
              className="time-select--wide"
            />
          </div>

          {/* Start time + Duration side by side */}
          <div className="form-row">
            <div className="form-group">
              <label>Start time</label>
              <div className="time-picker">
                <TimeSelect
                  value={form.startTime.split(":")[0]}
                  options={HOURS}
                  onChange={(h) => setForm((prev) => ({ ...prev, startTime: `${h}:${prev.startTime.split(":")[1]}` }))}
                />
                <span className="time-colon">:</span>
                <TimeSelect
                  value={form.startTime.split(":")[1]}
                  options={MINUTES}
                  onChange={(m) => setForm((prev) => ({ ...prev, startTime: `${prev.startTime.split(":")[0]}:${m}` }))}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Duration (min)</label>
              <div className="duration-picker">
                <button
                  type="button"
                  className="duration-btn"
                  onClick={() => setForm((prev) => ({ ...prev, duration: Math.max(15, prev.duration - 15) }))}
                >−</button>
                <span className="duration-value">{form.duration}</span>
                <button
                  type="button"
                  className="duration-btn"
                  onClick={() => setForm((prev) => ({ ...prev, duration: Math.min(480, prev.duration + 15) }))}
                >+</button>
              </div>
            </div>
          </div>

          {/* Color picker */}
          <div className="form-group">
            <label>Color</label>
            <div className="color-picker">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`color-swatch ${form.color === c ? "color-swatch--active" : ""}`}
                  style={{ background: c }}
                  onClick={() => setForm((prev) => ({ ...prev, color: c }))}
                  title={c}
                />
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label htmlFor="notes">Notes (optional)</label>
            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="e.g. Chapter 5 review, focus on integrals"
              rows={3}
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn" disabled={saving}>
              {saving ? "Saving…" : editingSession ? "Save changes" : "Add session"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
