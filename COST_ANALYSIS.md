# PaperShelf — AI API Cost Analysis

## Model Used
All AI features use **Claude claude-sonnet-4-6** via the Anthropic API.

## Pricing (as of June 2026)
| Token Type | Price |
|---|---|
| Input tokens | $3.00 per 1M tokens |
| Output tokens | $15.00 per 1M tokens |

---

## Feature 1: Paper Summarizer

**How it works:** User clicks "AI Summary" on any paper card. Sends paper details (title, authors, year, tags, notes) to Claude and receives a structured JSON response with summary, key topics, and importance.

**Token estimate per call:**
| | Tokens |
|---|---|
| System prompt + paper details (input) | ~300 tokens |
| JSON response (output) | ~200 tokens |
| **Total per call** | **~500 tokens** |

**Cost per call:** ~$0.004 (less than half a cent)

**Monthly estimate (100 calls):** ~$0.40

---

## Feature 2: Research Gap Finder

**How it works:** User clicks "Analyze Shelf". Sends ALL papers in the user's shelf to Claude and receives a comprehensive analysis of covered themes, gaps, and recommendations.

**Token estimate per call:**
| | Tokens |
|---|---|
| System prompt + all papers (input) | ~800 tokens (for 10 papers) |
| Full analysis JSON response (output) | ~600 tokens |
| **Total per call** | **~1,400 tokens** |

**Cost per call:** ~$0.011 (about 1 cent)

**Monthly estimate (50 calls):** ~$0.55

---

## Total Monthly Cost Estimate

| Feature | Calls/month | Cost |
|---|---|---|
| Paper Summarizer | 100 | $0.40 |
| Research Gap Finder | 50 | $0.55 |
| **Total** | **150** | **~$0.95/month** |

**Under $1/month for typical usage.** The free tier from Anthropic covers initial development and testing.

---

## Cost Controls Implemented
- API key stored in environment variables (never exposed in client bundle in production)
- Each call is user-initiated (no background polling or automatic calls)
- Error handling prevents retry loops that could inflate costs
- Loading states prevent duplicate submissions

## Scaling Notes
At 1,000 active users each making 5 AI calls/month:
- Total calls: 5,000/month
- Estimated cost: ~$32/month
- Still very affordable for a SaaS product at this scale