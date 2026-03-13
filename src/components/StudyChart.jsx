import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";

// Format minutes → "1h 30m" or "45m" for the tooltip
function formatMins(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

// Custom tooltip shown on hover
function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { subject, minutes } = payload[0].payload;
  return (
    <div className="chart-tooltip">
      <strong>{subject}</strong>
      <span>{formatMins(minutes)}</span>
    </div>
  );
}

export default function StudyChart({ sessions }) {
  // Sum minutes per subject
  const data = Object.values(
    sessions.reduce((acc, s) => {
      if (!acc[s.subject]) {
        acc[s.subject] = { subject: s.subject, minutes: 0, color: s.color || "#6366f1" };
      }
      acc[s.subject].minutes += s.duration || 0;
      return acc;
    }, {})
  ).sort((a, b) => b.minutes - a.minutes);

  if (data.length === 0) return null;

  return (
    <div className="chart-section">
      <h3 className="chart-title">Study time by subject</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="subject"
            tick={{ fontSize: 12, fill: "var(--clr-text-muted)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatMins}
            tick={{ fontSize: 11, fill: "var(--clr-text-muted)" }}
            axisLine={false}
            tickLine={false}
            width={48}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--clr-border)" }} />
          <Bar dataKey="minutes" radius={[6, 6, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.subject} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
