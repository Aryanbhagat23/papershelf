import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
});

// Feature 1: Summarize a single paper
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

// Feature 2: Research Gap Finder - analyzes entire reading shelf
export async function findResearchGaps(papers) {
  if (papers.length === 0) throw new Error("No papers to analyze");

  const paperList = papers.map((p, i) =>
    `${i + 1}. Title: ${p.title}
   Authors: ${p.authors || "Unknown"}
   Year: ${p.year || "Unknown"}
   Tags: ${p.tags || "None"}
   Status: ${p.status}
   Notes: ${p.notes || "None"}`
  ).join("\n\n");

  const prompt = `You are a research advisor helping a graduate student understand their research reading landscape.

The student has the following ${papers.length} papers in their reading shelf:

${paperList}

Please analyze their reading list and provide:
1. The main research themes they have covered (3-5 themes)
2. Significant gaps in their reading — important topics they are missing based on what they have read
3. 3 specific paper recommendations they should read next (with title and why it fills a gap)
4. An overall assessment of their research breadth

Respond in this exact JSON format:
{
  "coveredThemes": ["theme 1", "theme 2", "theme 3"],
  "gaps": [
    {"gap": "description of gap", "why": "why this matters"},
    {"gap": "description of gap", "why": "why this matters"},
    {"gap": "description of gap", "why": "why this matters"}
  ],
  "recommendations": [
    {"title": "Paper title", "reason": "why they should read this"},
    {"title": "Paper title", "reason": "why they should read this"},
    {"title": "Paper title", "reason": "why they should read this"}
  ],
  "assessment": "2-3 sentence overall assessment of their research reading breadth and focus"
}`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content[0].text;
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Invalid response format");
  return JSON.parse(jsonMatch[0]);
}