import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function summarizePaper(paper) {
  const prompt = `You are a research assistant helping a graduate student understand academic papers.

Given the following paper details, provide:
1. A 2-3 sentence summary of what this paper likely covers based on its title, authors, and tags
2. 3 key topics or concepts this paper probably addresses
3. Why this paper might be important for someone studying ${paper.tags || "computer science"}

Paper details:
- Title: ${paper.title}
- Authors: ${paper.authors || "Unknown"}
- Year: ${paper.year || "Unknown"}
- Tags: ${paper.tags || "None"}
- User notes: ${paper.notes || "None"}

Respond in this exact JSON format:
{
  "summary": "2-3 sentence summary here",
  "keyTopics": ["topic 1", "topic 2", "topic 3"],
  "importance": "1-2 sentence explanation of why this paper matters"
}`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content[0].text;
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Invalid response format");
  return JSON.parse(jsonMatch[0]);
}