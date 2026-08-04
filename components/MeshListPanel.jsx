"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, ChevronRight, Trash2, Pencil } from "lucide-react";

export default function MeshListPanel({ sceneData, selected, onToggleSelect, onDeleteRef, onEditOne }) {
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState(() => new Set(Object.keys(sceneData)));
  const groupNames = Object.keys(sceneData);

  function toggleGroup(groupName) {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      next.has(groupName) ? next.delete(groupName) : next.add(groupName);
      return next;
    });
  }

  return (
    <div
      className="absolute top-0 right-0 rounded-lg shadow-md border overflow-hidden"
      style={{ margin: "5px", background: "var(--color-surface)", borderColor: "var(--color-border)", width: 220, maxHeight: "70%" }}
    >
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium"
        style={{ color: "var(--color-fg)" }}
      >
        Meshes
        {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </button>

      {!collapsed && (
        <div className="overflow-y-auto px-2 pb-2 flex flex-col gap-1" style={{ maxHeight: 400 }}>
          {groupNames.length === 0 && (
            <p className="text-xs px-1" style={{ color: "var(--color-fg-muted)" }}>No meshes yet.</p>
          )}

          {groupNames.map((groupName) => {
            const shapes = sceneData[groupName];
            const isOpen = openGroups.has(groupName);

            return (
              <div key={groupName} className="flex flex-col gap-1">
                <button
                  onClick={() => toggleGroup(groupName)}
                  className="flex items-center gap-1 px-1 py-1 text-xs font-medium"
                  style={{ color: "var(--color-fg)" }}
                >
                  {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                  {groupName} <span style={{ color: "var(--color-fg-muted)" }}>({shapes.length})</span>
                </button>

                {isOpen && shapes.map((shape, i) => {
                  const key = `${groupName}-${i}`;
                  const isSelected = selected.has(groupName) || selected.has(key);
                  const displayName = shape.name || "(unnamed)";

                  return (
                    <div
                      key={key}
                      onClick={(e) => onToggleSelect(key, e.shiftKey)}
                      className="flex items-center justify-between pl-4 pr-2 py-1 rounded text-xs cursor-pointer"
                      style={
                        isSelected
                          ? { background: "var(--color-accent)", color: "var(--color-accent-fg)" }
                          : { background: "var(--color-bg)", color: "var(--color-fg)" }
                      }
                    >
                      <span className="truncate">{displayName}</span>
                      <span className="flex gap-1 shrink-0">
                        <button onClick={(e) => { e.stopPropagation(); onEditOne(key); }} title="Edit">
                          <Pencil size={12} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); onDeleteRef(groupName, i); }} title="Delete">
                          <Trash2 size={12} />
                        </button>
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}