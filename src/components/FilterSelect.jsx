import { useState, useRef, useEffect } from "react";

export default function FilterSelect({ value, options, placeholder = "All", onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const label = value === "" ? placeholder : value;

  return (
    <div className="filter-custom-select" ref={ref}>
      <button
        type="button"
        className="filter-custom-trigger"
        onClick={() => setOpen((o) => !o)}
      >
        <span>{label}</span>
        <span className="time-select-arrow">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <ul className="filter-custom-list">
          <li
            className={`filter-custom-option ${value === "" ? "filter-custom-option--active" : ""}`}
            onClick={() => { onChange(""); setOpen(false); }}
          >
            {placeholder}
          </li>
          {options.map((opt) => (
            <li
              key={opt}
              className={`filter-custom-option ${opt === value ? "filter-custom-option--active" : ""}`}
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
