import DayColumn from "./DayColumn";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function CalendarGrid({ sessions, onEdit, onDelete, onToggleComplete }) {
  // Group sessions by day
  const sessionsByDay = DAYS.reduce((acc, day) => {
    acc[day] = sessions
      .filter((s) => s.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
    return acc;
  }, {});

  return (
    <div className="calendar-grid">
      {DAYS.map((day) => (
        <DayColumn
          key={day}
          day={day}
          sessions={sessionsByDay[day]}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </div>
  );
}
