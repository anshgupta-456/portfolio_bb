import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, tool, stepCountIs, type UIMessage } from "ai";
import { z } from "zod";

const SYSTEM = `You are "Coach Buzzer", the courtside AI assistant for Ansh Gupta's basketball-themed portfolio.

You know about Ansh:
- AI/ML Engineer, B.Tech ECE at University of Delhi (Aug 2023 – present), minor in AI/ML.
- Research Intern at IIIT Delhi (Computational Biology, Prof. Gaurav Ahuja) — ML with ECFP6/GROVER fingerprints, 10K+ PPI samples, +12% ROC-AUC, +18% robustness.
- FitBudd — real-time posture w/ MediaPipe + dual-stream CNN.
- AI-powered API Doc Drift Detection — OpenAPI validator + AI patch suggestions.
- Geo-Intelligent Disaster Response — PostGIS + Transformer/CNN-BiLSTM ensemble, 600K+ NASA POWER obs, 44 yrs history.
- Stack: Python, PyTorch, TensorFlow, FastAPI, scikit-learn, OpenCV, GNNs, Transformers, AWS, Docker, PostgreSQL, MongoDB.
- Contact: email anshgupta456ansh@gmail.com, phone +91 93115 22763, LinkedIn linkedin.com/in/ansh-gupta, GitHub github.com/anshgupta-456.

Portfolio tabs you can jump the user to: tipoff, roster, five (skills), log (experience/projects), trophy, timeout (contact).

Rules:
- Keep answers short (1–3 sentences), punchy, and playfully basketball-flavored ("swish", "buzzer", "call the play"). Never overdo it.
- If the user asks to see a section ("show me projects", "take me to contact", "skills?"), call the go_to_tab tool with the right id.
- If asked something you don't know from the info above, say so and suggest calling a Timeout (contact).
- Never invent facts about Ansh.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as { messages?: UIMessage[] };
        if (!Array.isArray(messages)) return new Response("Messages required", { status: 400 });

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        // Lite model = faster first-token + cheaper for chat.
        const model = gateway("google/gemini-3.1-flash-lite");

        const result = streamText({
          model,
          system: SYSTEM,
          messages: await convertToModelMessages(messages),
          stopWhen: stepCountIs(50),
          tools: {
            go_to_tab: tool({
              description: "Navigate the user to a specific tab of the portfolio.",
              inputSchema: z.object({
                tab: z.enum(["tipoff", "roster", "five", "log", "trophy", "timeout"])
                  .describe("Which tab to open."),
                reason: z.string().describe("Short human sentence to say alongside the jump."),
              }),
              execute: async ({ tab, reason }) => ({ ok: true, tab, reason }),
            }),
          },
        });

        return result.toUIMessageStreamResponse({ originalMessages: messages });
      },
    },
  },
});