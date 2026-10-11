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
| Abstract-only synthesis | Abstracts omit methods detail, harms, subgroup findings, and author-stated limitations. Deep read helps only when PMC full text is available. | Partial: deep read exists |
| Deep read reads a truncated string | Full text is cut to 8,000 characters with no section awareness. | Roadmap: section chunking |
| No local policy connection | The policy bar is a placeholder. | Roadmap |

## Evidence quality

| Gap | Impact | Status |
| --- | --- | --- |
| Design-only grading | A labeled Level I review may be weaker than a well-run lower-level study. | Roadmap: second label for methodological quality and certainty |
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
- RN scope-of-practice language in every synthesis prompt
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
1. Section-aware full-text chunking for deep read
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
