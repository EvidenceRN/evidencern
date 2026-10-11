# EvidenceRN

**An open prototype for cited, evidence-graded answers to bedside nursing questions.**

Ask a clinical question in plain language. EvidenceRN searches PubMed, screens out retracted records, labels each source by evidence type (Melnyk & Fineout-Overholt hierarchy), and writes a short synthesized answer where every claim links to a numbered source. Follow-up questions reuse the same sources. A "deep read" pulls open-access full text from PubMed Central to refine the answer.

Status: **prototype (v0.5.2)**. EvidenceRN is a project of [AI + Nurse Academy](https://www.ainurseacademy.ai), built by a nurse practitioner to show what a transparent, open evidence assistant for nurses looks like. It is not a clinical decision support product. See [LIMITATIONS.md](LIMITATIONS.md) before using it for anything beyond exploration and education.

## Why this exists

Nurses need fast, trustworthy answers at the bedside. Commercial products are arriving in this space with proprietary evidence bases and institutional contracts. EvidenceRN takes a different path on purpose: public literature, visible search strategy, labeled evidence levels, retraction screening, and a citation check on every answer, all in a single readable file anyone can inspect, run, and improve.

The code is open under Apache 2.0. The name EvidenceRN belongs to the project founder (see [NOTICE](NOTICE)).

## What it does today

- Converts a conversational question into a PubMed Boolean query, with the exact query shown to the user
- Filters by evidence type (best available, systematic reviews, guidelines, RCTs, or any), recency, and nursing focus, and relaxes filters one axis at a time when strict searches return nothing
- Retrieves a wider candidate pool than requested, ranks by evidence level, and keeps the strongest set
- Excludes retracted publications and retraction notices using PubMed publication types and CommentsCorrections links; flags expressions of concern, errata, and linked updates on source cards
- Generates a three-section answer (bottom line, what the evidence shows, practice implications) with bracketed citations, written for RN scope of practice
- Runs a heuristic citation check on every answer and follow-up: citation numbers outside the source list and substantive sentences without a citation get flagged
- Deep read: retrieves PubMed Central full text for top Level I sources and revises the answer, with a "what the full text added" section and a comparison to the abstract-only answer
- Surfaces a hand-curated index of gray literature (CDC, AHRQ, NICE, ISMP, and others) by topic, clearly marked as not read by the synthesis engine
- Shows an urgent-situation banner when a question describes a potentially acute event
- Discloses that no institutional policy is connected

## Architecture

Two files do the work.

`public/index.html` is the whole user interface and client logic, dependency-free. It calls NLM E-utilities directly from the browser for search, abstracts, and PMC full text.

`server.js` is a zero-dependency Node server. It serves the UI and exposes one endpoint, `POST /api/ask`, which forwards a synthesis prompt to the Claude API using the key in `.env`. The key never reaches the browser.

Swapping the language model means editing one function in `server.js`. Swapping or adding an evidence source means adding a function alongside `pubmedSearch` in `index.html`.

## Run it locally

Requirements: Node.js 18 or newer, and an Anthropic API key from https://console.anthropic.com for the synthesis features. Search works without a key.

```bash
git clone https://github.com/EvidenceRN/evidencern.git
cd evidencern
cp .env.example .env     # paste your key after ANTHROPIC_API_KEY=
npm start                # or: node server.js
```

Open http://localhost:3000.

## Deploy

The project deploys as-is to Render, Fly.io, Railway, or any host running Node: start command `node server.js`, environment variable `ANTHROPIC_API_KEY`. Before exposing it publicly, add authentication or invite codes and per-user rate limits so strangers cannot spend your API budget. Neither exists yet; see the roadmap.

## Costs

Each search makes one or two model calls (query interpretation on longer questions, plus the synthesis). Follow-ups and deep reads add one call each. Ten abstracts per synthesis costs a few cents per question on a Sonnet-class model and less on Haiku. Set `ANTHROPIC_MODEL` in `.env` to change models.

## Safety and privacy

- No patient data is stored. Users should keep patient identifiers out of the search box; the UI does not yet enforce this.
- Evidence labels reflect study design inferred from PubMed metadata. No risk-of-bias assessment or GRADE rating is performed.
- The synthesis reads abstracts only, unless deep read succeeds. Abstracts omit methods detail, harms, and limitations.
- The footer disclaimer in the UI states these limits to every user. Keep it in any derivative.

## Contributing

Contributions are welcome, and the project is actively looking for two or three maintainers with engineering experience. Read [CONTRIBUTING.md](CONTRIBUTING.md) for how the project works, what help is most needed, and how maintainership is decided.

## License

Apache License 2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE).

## Acknowledgments

EvidenceRN is a project of [AI + Nurse Academy](https://www.ainurseacademy.ai), which offers nurse-led AI education for nurses and other clinicians. Project site: https://evidencern.com

Sources come from PubMed and PubMed Central, services of the U.S. National Library of Medicine. NLM does not endorse this software. Evidence-level labels follow Melnyk, B. M., & Fineout-Overholt, E., *Evidence-Based Practice in Nursing & Healthcare*.
