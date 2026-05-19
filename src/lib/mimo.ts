/**
 * Thin OpenAI-compatible client for Xiaomi MiMo v2.5 over OpenRouter.
 *
 * Two routes:
 *   - mimoText      → xiaomi/mimo-v2.5-pro (text, 1M ctx, deep reasoning)
 *   - mimoMultimodal → xiaomi/mimo-v2.5 (text + image + audio + video)
 *
 * Both use the same /chat/completions endpoint and the same MIMO_API_KEY.
 */

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content:
    | string
    | Array<
        | { type: "text"; text: string }
        | { type: "image_url"; image_url: { url: string } }
      >;
}

export interface MimoCallOptions {
  messages: ChatMessage[];
  /** Force a specific model id. Defaults to the text route. */
  model?: string;
  temperature?: number;
  maxTokens?: number;
  /** Stream Server-Sent Events from the upstream. */
  stream?: boolean;
  /** AbortSignal forwarded to fetch. */
  signal?: AbortSignal;
}

export interface MimoConfig {
  apiKey: string;
  baseUrl: string;
  textModel: string;
  vlModel: string;
}

export function getMimoConfig(): MimoConfig {
  return {
    apiKey: process.env.MIMO_API_KEY ?? "",
    baseUrl: process.env.MIMO_BASE_URL ?? "https://openrouter.ai/api/v1",
    textModel: process.env.MIMO_MODEL_TEXT ?? "xiaomi/mimo-v2.5-pro",
    vlModel: process.env.MIMO_MODEL_VL ?? "xiaomi/mimo-v2.5",
  };
}

export class MimoUnavailableError extends Error {
  constructor(message = "MIMO_API_KEY is not configured") {
    super(message);
    this.name = "MimoUnavailableError";
  }
}

async function callMimo(opts: MimoCallOptions): Promise<Response> {
  const cfg = getMimoConfig();
  if (!cfg.apiKey) {
    throw new MimoUnavailableError();
  }
  const model = opts.model ?? cfg.textModel;
  const body = {
    model,
    messages: opts.messages,
    temperature: opts.temperature ?? 0.3,
    max_tokens: opts.maxTokens ?? 1024,
    stream: opts.stream ?? false,
  };
  const res = await fetch(`${cfg.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cfg.apiKey}`,
      "HTTP-Referer": "https://chronos.vercel.app",
      "X-Title": "Chronos — Onchain Event Replay",
    },
    body: JSON.stringify(body),
    signal: opts.signal,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `MiMo upstream error ${res.status}: ${text.slice(0, 200)}`,
    );
  }
  return res;
}

export async function mimoText(opts: Omit<MimoCallOptions, "model">) {
  const cfg = getMimoConfig();
  return callMimo({ ...opts, model: cfg.textModel });
}

export async function mimoMultimodal(opts: Omit<MimoCallOptions, "model">) {
  const cfg = getMimoConfig();
  return callMimo({ ...opts, model: cfg.vlModel });
}

/**
 * Convenience wrapper for non-streaming JSON completion.
 */
export async function completeText(
  messages: ChatMessage[],
  opts: { temperature?: number; maxTokens?: number; signal?: AbortSignal } = {},
): Promise<string> {
  const res = await mimoText({ messages, ...opts, stream: false });
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return data.choices?.[0]?.message?.content?.trim() ?? "";
}
