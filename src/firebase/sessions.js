import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";

// Returns a reference to the current user's sessions collection
function sessionsRef(uid) {
  return collection(db, "users", uid, "sessions");
}

// ── Create ──────────────────────────────────────────────────────────────────

export async function addSession(uid, sessionData) {
  return addDoc(sessionsRef(uid), {
    ...sessionData,
    completed: false,
    createdAt: serverTimestamp(),
  });
}

// ── Read (live) ──────────────────────────────────────────────────────────────
// Calls onUpdate whenever sessions change in Firestore (on login, on any edit).
// Returns an unsubscribe function — call it when the component unmounts.

export function getSessions(uid, onUpdate) {
  return onSnapshot(sessionsRef(uid), (snapshot) => {
    const sessions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    onUpdate(sessions);
  });
}

// ── Update ───────────────────────────────────────────────────────────────────

export async function updateSession(uid, sessionId, changes) {
  const sessionDoc = doc(db, "users", uid, "sessions", sessionId);
  return updateDoc(sessionDoc, changes);
}

// ── Delete ───────────────────────────────────────────────────────────────────

export async function deleteSession(uid, sessionId) {
  const sessionDoc = doc(db, "users", uid, "sessions", sessionId);
  return deleteDoc(sessionDoc);
}
