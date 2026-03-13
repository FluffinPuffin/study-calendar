import { useEffect, useState } from "react";
import { getSubjects } from "../firebase/subjects";
import { useAuth } from "../context/AuthContext";

export function useSubjects() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    if (!user) return;
    getSubjects(user.uid).then(setSubjects);
  }, [user]);

  return subjects;
}
