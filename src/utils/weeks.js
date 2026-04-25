// Returns the Monday of the week containing `date` as a "YYYY-MM-DD" string.
// `offsetWeeks` shifts forward/back by that many weeks (0 = current week).
export function getWeekStart(offsetWeeks = 0) {
  const now = new Date();
  const day = now.getDay(); // 0 = Sun, 1 = Mon, …
  const diffToMonday = (day === 0 ? -6 : 1 - day);
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday + offsetWeeks * 7);
  // Use local date parts — toISOString() converts to UTC and can shift the day
  const y = monday.getFullYear();
  const m = String(monday.getMonth() + 1).padStart(2, "0");
  const d = String(monday.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Returns a human-readable label for the week at `offsetWeeks`.
// 0 → "This week", -1 → "Last week", else → "Mon D – Mon D"
export function getWeekLabel(offsetWeeks = 0) {
  if (offsetWeeks === 0) return "This week";
  if (offsetWeeks === -1) return "Last week";
  if (offsetWeeks === 1) return "Next week";

  const startStr = getWeekStart(offsetWeeks);
  const start = new Date(startStr + "T00:00:00");
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  const fmt = (d) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return `${fmt(start)} – ${fmt(end)}`;
}
