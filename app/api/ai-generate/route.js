import { NextResponse } from "next/server";
import { buildSystemPrompt } from "@/lib/aiPrompt";
import { parseLanguage, LanguageParseError } from "@/lib/language/parser";

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    status: { type: "string", enum: ["ok", "rejected"] },
    response: { type: "string" },
    script: { type: "string" },
  },
  required: ["status", "response", "script"],
};

const MOCK_MODE = process.env.MOCK_AI === "true";

function mockResponse(message) {
  if (/cube/i.test(message)) {
    return {
      status: "ok",
      response: "Added a cube at the requested position (mock response).",
      script: `cube "mock_cube" {\n  group: generated\n  pos: 0, 1, 0\n  size: 1, 1, 1\n  color: #4488ff\n}`,
    };
  }
  return {
    status: "rejected",
    response: "Mock mode: only understands requests containing the word 'cube'.",
    script: "",
  };
}

export async function POST(req) {
  const { message, assetScript } = await req.json();

  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "Missing message." }, { status: 400 });
  }

  let result;

  if (MOCK_MODE) {
    result = mockResponse(message);
  } else {
    const systemPrompt = buildSystemPrompt();
    const userPayload = `message: ${message}\n\nasset:\n${assetScript || "(empty scene)"}`;

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: [{ role: "user", parts: [{ text: userPayload }] }],
            generationConfig: {
              responseMimeType: "application/json",
              responseSchema: RESPONSE_SCHEMA,
            },
          }),
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        return NextResponse.json({ error: `AI request failed: ${errText}` }, { status: 502 });
      }

      const data = await res.json();
      const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!raw) return NextResponse.json({ error: "AI returned no content." }, { status: 502 });

      result = JSON.parse(raw);
    } catch (err) {
      return NextResponse.json({ error: "AI call failed: " + err.message }, { status: 500 });
    }
  }

  // Validate the AI's script server-side before handing it back, so the
  // frontend only ever has to deal with "did it run", not "is it well-formed".
  if (result.status === "ok" && result.script?.trim()) {
    try {
      parseLanguage(result.script);
    } catch (e) {
      const parseErrors = e instanceof LanguageParseError ? e.errors : [e.message];
      return NextResponse.json({
        status: "rejected",
        response: `AI produced an invalid script: ${parseErrors.join("; ")}`,
        script: "",
      });
    }
  }

  return NextResponse.json(result);
}