# Case File 002: Voice Search Audit

An independent, evidence-based product audit of mobile e-commerce voice search behavior on retail Android devices, structured as an investigative dossier.

## Overview
This project benchmarks natural voice dictation queries across several functional dimensions:
- Direct product lookup
- Numerical price constraints
- Comparative sort instructions
- Conversational follow-ups (anaphora resolution)
- Post-purchase support and order management
- Off-topic voice commands

## Project Structure
- `/data/`: Contains `scores.json`, `catalog.json`, `queries.json`, and `evals.json`.
- `/public/screens/`: Real audit screenshots referenced by the gallery.
- `/src/engine/`: Deterministic logic for baseline reconstruction and understanding layer.
- `/src/components/`: Accessible React components with evidence dossier styling.
- `/scripts/run_evals.py`: Reproducible evaluation runner script.

## Running Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Run unit test suite:**
   ```bash
   npm test
   ```

4. **Run evaluation script:**
   ```bash
   npm run evals
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

## Adding Screenshots
Place device captures into `/public/screens/` matching the filenames listed in `data/scores.json`.

## License
MIT
