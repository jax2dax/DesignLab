"use client";
import { useState } from "react";
import { refsToAddScript } from "@/lib/language/serializer";
import { parseLanguage, LanguageParseError } from "@/lib/language/parser";
import { applyLanguageOps } from "@/lib/language/apply";

export default function AiTextPanel({ sceneData, onApply, open, snapshotAvailable, onUndo }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [error, setError] = useState(null);

  if (!open) return null;

  function buildAssetScript() {
    const refs = [];
    Object.entries(sceneData).forEach(([groupName, shapes]) => {
      shapes.forEach((shape) => refs.push({ groupName, shape }));
    });
    return refsToAddScript(refs); // shows every mesh's real name, exactly what claw/slay need to target
  }

  async function handleSend() {
    if (!message.trim()) return;
    setLoading(true);
    setError(null);
    setAiResponse(null);

    try {
      const res = await fetch("/api/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, assetScript: buildAssetScript() }),
      });

      const rawText = await res.text();
      let data;
      try {
        data = JSON.parse(rawText);
      } catch {
        setError(`Server returned non-JSON (status ${res.status}).`);
        return;
      }

      if (data.error) {
        setError(data.error);
        return;
      }

      setAiResponse(data);

      if (data.status === "ok" && data.script?.trim()) {
        try {
          const ops = parseLanguage(data.script);
          const { sceneData: nextScene, errors: applyErrors } = applyLanguageOps(ops, sceneData);
          if (applyErrors.length > 0) {
            setError(applyErrors.join("\n"));
            return;
          }
          onApply(nextScene); // caller snapshots for undo
        } catch (e) {
          setError(
            "AI returned a script that failed to run:\n" +
            (e instanceof LanguageParseError ? e.errors.join("\n") : e.message)
          );
        }
      }
    } catch (e) {
      setError("Request failed: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="absolute rounded-lg shadow-md border flex flex-col"
      style={{
        top: 56,
        left: 5,
        width: "clamp(280px, 28vw, 480px)",
        maxHeight: "60vh",
        background: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="px-3 py-2 text-sm font-medium border-b" style={{ borderColor: "var(--color-border)", color: "var(--color-fg)" }}>
        Describe what you want
      </div>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="e.g. change the porch pillar to black, or add a cube on top of the sphere"
        rows={3}
        className="p-2 text-sm resize-none outline-none"
        style={{ background: "var(--color-bg)", color: "var(--color-fg)" }}
      />

      <div className="flex gap-2 px-2 pb-2">
        <button
          onClick={handleSend}
          disabled={loading}
          className="flex-1 rounded px-3 py-1.5 text-sm disabled:opacity-50"
          style={{ background: "var(--color-accent)", color: "var(--color-accent-fg)" }}
        >
          {loading ? "Thinking..." : "Send"}
        </button>
        {snapshotAvailable && (
          <button onClick={onUndo} className="rounded px-3 py-1.5 text-sm border"
            style={{ borderColor: "var(--color-border)", color: "var(--color-fg)" }}>
            Undo
          </button>
        )}
      </div>

      {aiResponse && (
        <div className="px-3 pb-2 text-xs" style={{ color: "var(--color-fg-muted)" }}>{aiResponse.response}</div>
      )}
      {error && (
        <div className="px-3 pb-2 text-xs whitespace-pre-line" style={{ color: "var(--color-danger)" }}>{error}</div>
      )}
    </div>
  );
}