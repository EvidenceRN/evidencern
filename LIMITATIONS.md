# Known limitations and roadmap

This file is deliberately blunt. EvidenceRN is a prototype. Read this before relying on it for anything beyond exploration, teaching, or demonstration.

## What it is not

- Not a clinical decision support product. No validation study has been performed.
- Not a substitute for institutional policy, protocols, or provider orders.
- Not a formal evidence appraisal. Labels reflect study design inferred from PubMed metadata, with no risk-of-bias or GRADE assessment.
- Not PHI-safe by design. Nothing is stored, but nothing prevents a user from typing patient identifiers either.

## Evidence coverage

| Gap | Impact | Status |
| --- | --- | --- |
| PubMed only | Misses CINAHL, JBI, Cochrane full text, specialty-society guidelines, and institutional policy. PubMed underrepresents nursing implementation and quality-improvement literature. | Roadmap, requires licensed sources for some |
| Gray literature is linked, not read | A relevant guideline can appear below an answer without the answer reflecting it. The UI says so explicitly. | Roadmap: guideline ingestion |
| Abstract-only synthesis | Abstracts omit methods detail, harms, subgroup findings, and author-stated limitations. Deep read helps only when PMC full text is available. Abstracts over 5,000 characters (3,000 in follow-ups) are clipped from the middle so the conclusions survive. | Partial: deep read exists |
| Deep read reads a ranked, capped extract | Top-level JATS sections are ordered results, discussion and conclusions, methods, introduction, each capped at 6,000 characters, within a 12,000 character budget per source. Nested subsections are flattened into their parent, and tables and figures are read as text. Articles without section markup fall back to the first 12,000 characters. | Partial since v0.5.3 |
| No local policy connection | The policy bar is a placeholder. | Roadmap |

## Evidence quality

| Gap | Impact | Status |
| --- | --- | --- |
| Design-only grading | A labeled Level I review may be weaker than a well-run lower-level study. | Roadmap: second label for methodological quality and certainty |
| Trial label depends on PubMed publication types | A record carrying only the Clinical Trial type (which NLM defines without requiring a control group) is labeled "Trial, control not stated" and sorted with observational designs. Indexers assign publication types inconsistently, so a controlled trial indexed with the bare type is under-labeled, and the reverse also happens. | Partial since v0.5.3 |
| Scope of practice is assumed, not checked | Answers assume a generalist RN scope and say so. Scope is set by state nurse practice acts, setting, and employer policy, none of which the app knows. | Roadmap: role and state selector |
| No evidence versus no effect | Prompts require the model to separate sources that did not study the question from sources that found no difference, and to open the bottom line with a fixed phrase naming which applies. Whether the model follows the rule reliably is untested until the validation set includes both kinds of question. | Partial since v0.5.3 |
| Retraction screening depends on PubMed metadata | Retractions not yet linked in PubMed are missed. | Partial: pubtype and CommentsCorrections checks exist |
| Guideline currency unknown | No check for superseded guidelines beyond PubMed update links. | Roadmap |
| Citation check is heuristic | The validator flags missing or out-of-range citation numbers. It does not verify a cited abstract supports the claim. | Partial |
| No PICO or MeSH expansion | Query interpretation is a single model call producing a Boolean keyword string. | Roadmap |

## Engineering

| Gap | Impact | Status |
| --- | --- | --- |
| No authentication or rate limiting | Public deployment exposes the host's API budget. | Roadmap, top priority before any public URL |
| No audit log | Model version, prompt version, query, sources, and answer are not recorded. | Roadmap |
| PubMed calls originate in the browser | Subject to NCBI's per-IP limits for unkeyed requests. | Roadmap: server-side proxy with API key |
| Gray-literature index is hand-maintained | Links verified July 2026 and will drift. | Needs periodic re-verification |
| No automated tests | Changes are checked by hand. | Roadmap: validation set plus answer regression tests |

## Safety behaviors present today

- Urgent-situation banner on questions matching acute-event patterns (chest pain, sepsis, stroke, suicide risk, and others)
- Generalist RN scope assumption stated in every synthesis prompt and printed under every answer's practice implications
- Prompt rule separating "the sources did not study this" from "the sources found no difference"
- Applicability-limit instruction when the evidence poorly represents the population in the question
- Retracted records excluded before ranking and synthesis
- Expressions of concern, errata, and update links flagged on source cards and disclosed to the synthesis model
- Citation check on every answer and follow-up
- Run-token protection so a new search cannot be overwritten by a stale answer
- Maturity banner and full footer disclaimer on every page

## Roadmap

### Before further demo use
1. Validation set of real nursing questions with clinician-written expectations
2. Authentication, invite codes, and rate limiting
3. Server-side PubMed proxy with NCBI API key

### Next version
1. Deep read: nested subsection handling, table extraction, and a larger budget once prompts move server-side
2. PICO parser with MeSH expansion
3. Audit logging of every request
4. Guideline ingestion for the gray-literature index
5. "Evidence limitations" field per answer (population, setting, outcome, date range)

### Clinical-grade version
1. CINAHL, JBI, Cochrane, and specialty-society guideline integration
2. Risk-of-bias and GRADE-style certainty labels alongside design labels
3. Local policy connection with precedence over external literature
4. Clinician review workflow before any answer enters policy, protocol, or education
5. Prospective evaluation against the validation set, published

## Acknowledgment

Several items in this list come from an external code review conducted in mid-2026 that evaluated the prototype's completeness, evidence quality, and engineering risks. The race-condition, fallback-order, candidate-pool, retraction-screening, and citation-check fixes shipped in v0.5 through v0.5.2 in response to that review.

The v0.5.3 changes (section-aware deep read, longer abstract windows, a separate label for trials whose PubMed metadata states no control group, the rule separating no evidence found from evidence of no effect, and the stated scope assumption) respond to a clinician code review by Sarah Curtright, DNP, MBA, in October 2026.
