# Audit Methodology, Limitations & Evidence Protocol

## Objective & Scope
This investigation evaluates the real-world shopping experience of a voice-first user on the production Android Meesho app as of November 2026. While Meesho publicly announced **Vaani** (a dedicated vernacular voice assistant for next-billion shoppers), no independent dedicated Vaani entry point was accessible on the updated production app on the test device. Consequently, this audit measures what real users can reach today: **direct voice dictation via the phone keyboard into Meesho's universal search bar**.

## Test Setup & Execution Protocol
1. **Device & Environment:** Production Android smartphone running updated Meesho app (v19.x), Android 14. Network: High-speed 5G cellular connection in India.
2. **Audio Input Channel:** Standard Google Voice Typing (Gboard) activated by tapping the keyboard mic icon while focused on the Meesho search bar.
3. **Spoken Corpus:** 28 representative natural voice utterances spanning Hindi, Hinglish, and colloquial English across 7 functional groups:
   - Group A: Plain product direct search
   - Group B: Explicit price caps / budget constraints
   - Group C: Relative sort & comparative pricing ("sasta", "cheapest")
   - Group D: Attributes, ratings, sizes, and materials
   - Group E: Conversational multi-turn follow-ups
   - Group F: Post-purchase support & order tracking
   - Group G: Off-topic speech & conversational commands
4. **Transcription vs. Processing Isolation:** For each test run, the exact transcribed text produced by Gboard was recorded, and compared against the query string Meesho actually passed to its backend. This decoupled automatic speech recognition (ASR) errors from Meesho's downstream NLP/search pipeline.

## Evaluation Rubric (3-Point Outcome-Based Scoring)
Scoring was based strictly on **what the shopper experiences on screen**:
- **PASS (✓):** The shopper receives relevant products adhering to stated constraints (or appropriate action taken).
- **PARTIAL (◐):** The shopper receives roughly related products, but critical constraints (sorting, ratings, specific qualifiers) are dropped or ignored.
- **FAIL (✗):** Irrelevant results, absurd catalog matches for support queries, or complete comprehension collapse.

## Known Boundaries & Caveats
- **Black-Box Testing:** Conducted entirely from the user client side without internal telemetry or access to Meesho's private microservices.
- **Price Cap Observation:** In all tests where loose price caps were spoken (e.g. kurti under 700, saree under 500), results met the ceiling. However, because budget items dominate Meesho's catalog regardless, whether price caps are formally parsed or merely co-occur with cheap items remains **UNPROVEN**. Tight caps (e.g. kurti under 120) require further testing.
- **Interactive Engine Reconstruction:** The demo uses deterministic local parsing rules and a mock catalogue of 40 representative items to reconstruct observed behavior versus the proposed fix. It does not ping Meesho's live servers.
- **Audit Date:** Conducted and dated November 2026.
