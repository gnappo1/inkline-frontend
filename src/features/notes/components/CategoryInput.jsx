import { useState } from "react";

function CategoryInput({ value = [], onChange }) {
  const [text, setText] = useState("");

  function addTag(name) {
    const v = name.trim();
    if (!v) return;
    if (!value.includes(v)) onChange([...value, v]);
    setText("");
  }

  function removeTag(name) {
    onChange(value.filter((t) => t !== name));
  }

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {value.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-[hsl(var(--card))] border border-black/10 dark:border-white/10"
          >
            {t}
            <button
              className="opacity-60 hover:opacity-100"
              onClick={() => removeTag(t)}
              aria-label={`Remove ${t}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="input flex-1"
          placeholder="Add category and press Enter"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag(text);
            }
          }}
        />
        <button className="btn btn-ghost" onClick={() => addTag(text)}>
          Add
        </button>
      </div>
    </div>
  );
}

export default CategoryInput;
