import { useState, useRef, useEffect } from "react";

export default function TimeSelect({ value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="time-select" ref={ref}>
      <button
        type="button"
        className="time-select-trigger"
        onClick={() => setOpen((o) => !o)}
      >
        {value}
        <span className="time-select-arrow">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <ul className="time-select-list">
          {options.map((opt) => (
            <li
              key={opt}
              className={`time-select-option ${opt === value ? "time-select-option--active" : ""}`}
              onClick={() => { onChange(opt); setOpen(false); }}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
