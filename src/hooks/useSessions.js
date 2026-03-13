import { useEffect, useState } from "react";
import { getSessions } from "../firebase/sessions";
import { useAuth } from "../context/AuthContext";

export function useSessions() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // getSessions returns an unsubscribe function.
    // React calls it automatically on cleanup (logout or unmount).
    const unsubscribe = getSessions(user.uid, (data) => {
      setSessions(data);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  return { sessions, loading };
}
