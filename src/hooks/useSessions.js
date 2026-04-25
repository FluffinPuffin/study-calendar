import { useEffect, useState } from "react";
import { getSessions } from "../firebase/sessions";
import { useAuth } from "../context/AuthContext";
import { getWeekStart } from "../utils/weeks";

export function useSessions(weekStart) {
  const { user } = useAuth();
  const [allSessions, setAllSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = getSessions(user.uid, (data) => {
      setAllSessions(data);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const currentWeekStart = getWeekStart(0);
  const isCurrentWeek = weekStart === currentWeekStart;

  const sessions = allSessions
    .filter((s) => {
      if (s.weekStart === weekStart) return true;
      if (s.recurring && !s.weekStart) return true;
      if (!s.weekStart && !s.recurring && isCurrentWeek) return true;
      return false;
    })
    .map((s) => {
      if (!s.recurring) return s;
      // Recurring sessions store per-week completion in completedWeeks array
      return { ...s, completed: (s.completedWeeks || []).includes(weekStart) };
    });

  return { sessions, loading };
}
