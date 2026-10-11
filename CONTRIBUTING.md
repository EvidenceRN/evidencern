# Contributing to EvidenceRN

Thank you for your interest. This document explains how the project works, what help matters most, and how to get involved.

## How the project is run

EvidenceRN is a project of [AI + Nurse Academy](https://www.ainurseacademy.ai). It was built by Stephen A. Ferrara, DNP, RN, FNP-BC, FAAN, FAANP, a family nurse practitioner and founder of AI + Nurse Academy, as a working prototype of a transparent evidence assistant for nurses. He sets clinical direction and product priorities. He is not a full-time engineer and does not plan to be the day-to-day maintainer.

**The project is looking for two or three maintainers.** If you want the role, the path is through work: open issues, submit pull requests, review others' pull requests, and show consistent judgment over a few weeks. Maintainers get merge rights and a voice in the roadmap. Clinical and safety decisions stay with the clinical lead.

Nurses, nurse informaticists, clinical librarians, and evidence-based practice educators are as welcome as engineers. Reviewing answer quality, reporting bad citations, curating the gray-literature index, and writing test questions are all contributions.

## What help is most needed

In rough priority order:

1. **A validation set.** Fifty to one hundred real nursing questions across acute care, primary care, geriatrics, pediatrics, women's health, infection prevention, medication safety, wounds, and transitions of care, each with a clinician-written note on what a good answer must contain. This is the foundation for every other improvement.
2. **Authentication and rate limiting** in `server.js`, so the project can be deployed publicly without exposing the host's API budget.
3. **Server-side PubMed proxy** with NCBI API key support, for higher rate limits.
4. **Full-text section chunking** for deep read (methods, results, limitations, conclusion as separate blocks), replacing the current truncated single string.
5. **Guideline ingestion**: retrieving and reading the gray-literature documents the index currently only links to.
6. **Additional evidence sources** behind the same interface as `pubmedSearch` (CINAHL, JBI, Cochrane require licenses; discuss in an issue first).
7. **Audit logging**: model version, prompt version, query, source list, date, and answer hash per request.

See [LIMITATIONS.md](LIMITATIONS.md) for the full known-issues list and roadmap.

## Ground rules for changes

- **Keep the disclaimers.** The maturity banner and footer text exist so every user knows what the tool does and does not do. Changes to their wording need clinical-lead sign-off.
- **Keep the citations honest.** Any change to the synthesis prompt or the citation validator must be tested against the validation set (or, until one exists, against the eight quick-topic questions in the UI) and the before/after answers posted in the pull request.
- **Scope of practice stays in.** The prompt language about RN scope, provider orders, and advanced practice licensure is a safety feature, not boilerplate.
- **No patient data.** Do not add features that store queries tied to identifiable users without a documented privacy design.
- **Dependency-light.** The project runs with zero npm dependencies on purpose so anyone can read and run it. Adding a dependency needs a reason in the pull request.
- **Single file UI.** `public/index.html` stays self-contained until the project is large enough to justify a build step. Propose the split in an issue before doing it.

## Submitting a change

1. Open an issue first for anything beyond a small fix, so the approach gets agreed before you spend time on it.
2. Fork, branch, make the change.
3. Run `node --check server.js` and load the UI in a browser. Run the quick-topic chips and at least one free-text question. Note what you saw in the pull request.
4. Keep pull requests focused on one change.
5. By submitting a contribution you agree it is licensed under the Apache License 2.0 (see Section 5 of LICENSE).

## Reporting answer-quality problems

Bad answers are the most valuable bug reports. Open an issue titled `Answer quality: <short description>` and include the question, the filters used, the exact PubMed query shown in the "How this answer was searched" panel, the answer text, and what was wrong with it (missed source, wrong citation, unsupported claim, scope-of-practice error, missing caveat).

## Security

If you find a vulnerability (for example a way to extract the API key or bypass a future rate limit), email the maintainer listed in `package.json` rather than opening a public issue.

## Conduct

Be direct and kind. Assume good faith. Clinical disagreements get settled with evidence. Personal attacks, harassment, or discrimination of any kind lead to removal from the project. The [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/) applies.
