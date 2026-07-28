"use client";
import { useState } from "react";

export default function GroupList({ data, onDeleteGroup, onDeleteShape, onEditShape, selected, onToggleSelect }) {
  const [editingKey, setEditingKey] = useState(null);
  const [editText, setEditText] = useState("");
  const [error, setError] = useState(null);

  const groupNames = Object.keys(data);
  if (groupNames.length === 0) {
    return <p className="text-sm text-gray-400">No groups yet.</p>;
  }

  function startEdit(groupName, index, shape) {
    setEditingKey(`${groupName}-${index}`);
    setEditText(JSON.stringify(shape, null, 2));
    setError(null);
  }
  function cancelEdit() {
    setEditingKey(null);
    setError(null);
  }
  function saveEdit(groupName, index) {
    let parsed;
    try {
      parsed = JSON.parse(editText);
    } catch (e) {
      setError("Invalid JSON: " + e.message);
      return;
    }
    onEditShape(groupName, index, parsed);
    setEditingKey(null);
    setError(null);
  }

  return (
    <div className="flex flex-col gap-3">
      {groupNames.map((groupName) => (
        <div key={groupName} className="border rounded px-3 py-2">
          <div className="flex items-center justify-between text-sm mb-1">
            <label className="flex items-center gap-2 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={selected.has(groupName)}
                onChange={() => onToggleSelect(groupName)}
              />
              {groupName}{" "}
              <span className="text-gray-500 font-normal">
                ({data[groupName].length} mesh{data[groupName].length !== 1 ? "es" : ""})
              </span>
            </label>
            <button
              onClick={() => onDeleteGroup(groupName)}
              className="text-red-600 hover:text-red-800 text-xs font-medium px-2 py-0.5 rounded hover:bg-red-50"
            >
              Delete group
            </button>
          </div>

          <ul className="flex flex-col gap-1 pl-2">
            {data[groupName].map((shape, index) => {
              const key = `${groupName}-${index}`;
              const isEditing = editingKey === key;

              return (
                <li key={key} className="text-xs border-t pt-1">
                  {!isEditing ? (
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selected.has(key)}
                          onChange={() => onToggleSelect(key)}
                        />
                        {shape.type} — pos [{shape.pos.join(", ")}]
                      </label>
                      <span className="flex gap-2">
                        <button onClick={() => startEdit(groupName, index, shape)} className="text-blue-600 hover:text-blue-800">Edit</button>
                        <button onClick={() => onDeleteShape(groupName, index)} className="text-red-600 hover:text-red-800">Delete</button>
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1 mt-1">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={5}
                        className="border rounded px-2 py-1 font-mono text-xs"
                      />
                      {error && <p className="text-red-600">{error}</p>}
                      <div className="flex gap-2">
                        <button onClick={() => saveEdit(groupName, index)} className="bg-blue-600 text-white rounded px-2 py-0.5 hover:bg-blue-700">Save changes</button>
                        <button onClick={cancelEdit} className="text-gray-500 hover:text-gray-700">Cancel</button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}