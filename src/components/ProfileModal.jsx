import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function ProfileModal({ onClose }) {
  const { user, updateDisplayName } = useAuth();
  const [name, setName] = useState(user.displayName || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError("");
    try {
      await updateDisplayName(name.trim());
      onClose();
    } catch {
      setError("Could not update name. Try again.");
    } finally {
      setSaving(false);
    }
  }

  // Use first letter of display name or email for the avatar
  const avatarLetter = (user.displayName || user.email || "?")[0].toUpperCase();

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal profile-modal" onClick={(e) => e.stopPropagation()}>

        <div className="modal-header">
          <h2 className="modal-title">Edit profile</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Avatar */}
        <div className="profile-avatar-wrap">
          <div className="profile-avatar">{avatarLetter}</div>
        </div>

        <form onSubmit={handleSave} className="modal-form">
          <div className="form-group">
            <label className="form-label">Display name</label>
            <input
              className="form-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="text"
              value={user.email}
              disabled
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn" disabled={saving || !name.trim()}>
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
