import Anthropic from "@anthropic-ai/sdk";

interface InputPrompt {
  systemPrompt: string;
  userMessage: string;
}

const client = new Anthropic();

export const callClaude = async (input: InputPrompt): Promise<string> => {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Get a key at https://console.anthropic.com and set it in your environment.",
    );
  }

  const message = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 256,
    system: input.systemPrompt,
    messages: [{ role: "user", content: input.userMessage }],
  });

  const block = message.content[0];
  if (!block) throw new Error("No response from Claude");
  if (block.type !== "text")
    throw new Error("Unexpected response type from Claude");
  return block.text.trim();
};
