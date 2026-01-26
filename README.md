# Lattice — Case Study

A product design case study exploring next-generation ML experiment tracking.

## Overview

This case study documents the research and design process for Lattice, a concept for graph-based experiment tracking that addresses gaps in current ML tooling.

**Research scope:**
- 12 in-depth interviews
- 47 survey responses  
- Telemetry partnership with 2 ML teams
- Competitive analysis of 5 tools

**Key insight:** Current tools optimize for experimentation (which already works well). The real pain is in reproduction — where 43% of workflow time is spent with almost no tool support.

## Run locally

```bash
npm install
npm run dev
```

## Build for production

```bash
npm run build
```

## Deploy to GitHub Pages

This project is configured for GitHub Pages deployment. After building:

1. Push to GitHub
2. Go to Settings → Pages
3. Set source to GitHub Actions
4. Use the included workflow (or deploy the `dist` folder)

## Tech stack

- React 18
- Vite
- Vanilla CSS (inline styles)

## Structure

```
src/
  LatticeCase.jsx   # Main case study component
  main.jsx          # Entry point
index.html          # HTML template with fonts
```

---

*This is a portfolio case study, not a production product.*
