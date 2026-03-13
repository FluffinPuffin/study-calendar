import {
  collection,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "./config";

function subjectsRef(uid) {
  return collection(db, "users", uid, "subjects");
}

// Fetch all subjects for a user (one-time read)
export async function getSubjects(uid) {
  const snapshot = await getDocs(subjectsRef(uid));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Save or update a subject's color.
// Uses the subject name (lowercased) as the document ID so duplicates are
// automatically overwritten rather than creating new documents.
export async function upsertSubject(uid, name, color) {
  const id = name.trim().toLowerCase();
  const ref = doc(db, "users", uid, "subjects", id);
  await setDoc(ref, { name: name.trim(), color }, { merge: true });
}
