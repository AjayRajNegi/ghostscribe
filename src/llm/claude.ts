import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export const callClaude = async (prompt: string): Promise<string> => {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Get a key at https://console.anthropic.com and set it in your environment.",
    );
  }

  const message = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 256,
    messages: [{ role: "user", content: prompt }],
  });

  const block = message.content[0];
  if (!block) throw new Error("No response from Claude");
  if (block.type !== "text")
    throw new Error("Unexpected response type from Claude");
  return block.text.trim();
};
