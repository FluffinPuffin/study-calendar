import { useDroppable } from "@dnd-kit/core";
import SessionCard from "./SessionCard";

export default function DayColumn({ day, sessions, onEdit, onDelete, onToggleComplete }) {
  const { setNodeRef, isOver } = useDroppable({ id: day });

  return (
    <div className="day-column">

      <div className="day-header">
        <span className="day-name">{day.slice(0, 3).toUpperCase()}</span>
        <span className="day-count">
          {sessions.length > 0 ? `${sessions.length} session${sessions.length > 1 ? "s" : ""}` : ""}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`day-sessions ${isOver ? "day-sessions--over" : ""}`}
      >
        {sessions.length === 0 ? (
          <p className="day-empty">—</p>
        ) : (
          sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleComplete={onToggleComplete}
            />
          ))
        )}
      </div>

    </div>
  );
}
