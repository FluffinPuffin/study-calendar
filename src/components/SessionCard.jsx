import { useDraggable } from "@dnd-kit/core";

export default function SessionCard({ session, onEdit, onDelete, onToggleComplete }) {
  const { id, subject, startTime, duration, notes, color, completed } = session;
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });

  // Convert "09:00" + duration in minutes to "9:00 AM – 10:30 AM"
  function formatTimeRange(start, mins) {
    const [h, m] = start.split(":").map(Number);
    const startDate = new Date(0, 0, 0, h, m);
    const endDate = new Date(0, 0, 0, h, m + mins);
    const fmt = (d) =>
      d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    return `${fmt(startDate)} – ${fmt(endDate)}`;
  }

  const dragStyle = {
    borderLeftColor: color || "var(--clr-primary)",
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 999 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      className={`session-card ${completed ? "session-card--done" : ""}`}
      style={dragStyle}
    >
      {/* Top row: drag handle + subject + action buttons */}
      <div className="session-card-top">
        <span className="drag-handle" {...attributes} {...listeners} title="Drag to move">⠿</span>
        <span className="session-card-subject">{subject}</span>
        <div className="session-card-actions">
          <button
            className="icon-btn"
            title="Edit"
            onClick={() => onEdit(session)}
          >
            ✏️
          </button>
          <button
            className="icon-btn"
            title="Delete"
            onClick={() => onDelete(id)}
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Time range */}
      <div className="session-card-time">
        {formatTimeRange(startTime, duration)}
        <span className="session-card-duration"> · {duration}min</span>
      </div>

      {/* Notes (only shown if present) */}
      {notes && <p className="session-card-notes">{notes}</p>}

      {/* Complete toggle */}
      <label className="session-card-complete">
        <input
          type="checkbox"
          checked={completed}
          onChange={() => onToggleComplete(session)}
        />
        <span>{completed ? "Completed" : "Mark complete"}</span>
      </label>
    </div>
  );
}
