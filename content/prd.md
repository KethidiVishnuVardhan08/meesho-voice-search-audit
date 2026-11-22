# PRD: Voice Understanding & Intent Routing Layer for Tier 2/3 Shoppers

## Problem Statement
Meesho's voice search currently operates as an unbuffered pass-through to a literal text catalog search. For Bharat shoppers dictating in natural conversational Hindi/Hinglish, this creates five catastrophic failure modes:
1. **Sort & Rating Blindness (F1):** Shoppers asking for *"cheapest raincoat"* or *"sasta dikhao"* get arbitrary keyword matches, returning expensive items first.
2. **Zero Conversational Memory (F2):** Follow-ups like *"isase sasta dikhao"* drop conversational context and search the literal Hindi pronoun `"isase"`, showing ice cube moulds and vinegar.
3. **Intent Misrouting (F3):** Critical support requests (*"mera order kahan hai"*, *"delivery kitne din mein hoga"*, *"customer care number"*) and off-topic speech (*"play a good song"*) are treated as e-commerce catalog keywords, displaying absurd listings (insemination kits, hangers, thread books).
4. **Tragic Query Truncation (F4):** Conversational preambles and qualifiers get aggressively butchered (*"double bed"* dropped, *"delivery kitne din mein hoga"* truncated into *"dhaga"*).
5. **Vernacular Token Distortion (F5):** Regional colloquialisms produce unpredictable search transformations.

## Proposed Architecture: The Client-Side Understanding Layer
Before queries hit Meesho's Elasticsearch/Solr cluster, an intermediate intent & entity extraction microservice evaluates the transcribed utterance:

```
[Voice / Keyboard Dictation]
            │
            ▼
[Conversational Normalizer & Lexicon Matcher]
  ├─ Intent Classifier (shop | follow-up | support | off-topic)
  ├─ Entity & Slot Extractor:
  │    - Price Cap: "ke andar", "se kam", "under", "below" -> max_price: N
  │    - Relative Sort: "sasta", "cheapest", "budget" -> sort: price_asc
  │    - Rating Floor: "rated X above", "X star se upar" -> min_rating: X
  │    - Spec & Occasion: "double bed", "wedding", "office", "summer"
  └─ Session State Manager:
       - Retains last valid product query & active filters for 5 turns
       - Resolves anaphoric pronouns ("isse", "isase", "isme")
            │
      ┌─────┴────────────────────────┐
      ▼                              ▼
[Support / Off-Topic Route]     [Structured Catalog Search]
- Order status & tracking UI     - Target product keywords
- Customer care direct action    - Server-side filter parameters
- Polite off-topic guardrail     - Explicit order_by price_asc
```

## Functional Requirements
1. **Intent Extraction:** Distinguish transactional catalog queries from customer support and general voice commands with 99%+ precision.
2. **Support Routing:** Automatically intercept post-purchase and order status queries to display an in-app tracking card or direct helpline modal, bypassing product search entirely.
3. **Graceful Off-Topic Handling:** When a user asks off-topic queries (e.g. songs, weather, jokes), provide a friendly vernacular response and quick chips back to relevant shopping categories.
4. **Constraint & Sort Binding:** Map vernacular comparative markers directly to backend query filters rather than treating them as catalog keywords.
5. **Conversational Context Window:** Store the active product category, gender, and price bracket in client session state to enable multi-turn refinements like *"isse sasta dikhao"*.
