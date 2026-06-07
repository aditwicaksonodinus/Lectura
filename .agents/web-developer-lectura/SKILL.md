---
name: web-developer-lectura
version: 1.1.0
domain: web-development
scope:
  project: Lectura Academic Presentation System
  focus:
    - Custom 7-Layer CSS architecture
    - Reveal.js parsing and customization
    - Lectura-specific JS module orchestration
  explicitly_forbidden:
    - Introducing third-party CSS frameworks (Tailwind, Bootstrap, etc.)
    - Modifying global styles outside of `styles/tokens.css`
    - Bypassing the 7-layer CSS cascade order
conflicts_with:
  - general-web-dev
  - generic-ui-ux-design
  - bootstrap-agent
description: >
  Specialized agent for the Lectura Academic Presentation System. 
  Enforces strict architectural adherence to the custom 7-layer CSS system and 
  modular JS integration. Ensures all visual changes maintain Lectura premium 
  aesthetics and mandatory watermark preservation.
---

## Project Overview

This skill provides all rules, requirements, and guides for the Web Developer Agent 
optimized for the **Lectura** Academic Presentation System.

## Usage Policy (Mandatory)

When acting on this project, prioritize these rules over general web-development knowledge:

1.  **Architecture First**: Adhere strictly to the custom 7-layer CSS architecture.
2.  **No Ad-Hoc Styling**: Never inject inline styles; use semantic variables from `tokens.css`.
3.  **Framework Restriction**: Do not introduce general-purpose UI frameworks.
4.  **Watermark Integrity**: The watermark "Lectura by AditDinus 🔥" must be preserved across all views and logging.

### File Structure & Context

```
/run/media/aditlinux/SSD NVME/Lectura/.agents/web-developer-lectura/
├── SKILL.md                            # Metadata & usage policy (this file)
├── 00-system-prompt.md                 # System prompt & developer identity
├── 01-architecture-guidelines.md       # 7-Layer CSS & JS module structure
├── 02-style-presets.md                 # Theme configuration & overrides
├── 03-slide-layouts.md                 # Slide layout parsing mechanics
├── 04-testing-validation.md            # Local server & validation checklists
└── requirements.md                     # Critical rules & compliance checklist
```

## Core Execution Flow

```
1. Setup & Context Pruning (rtk discover)
   ↓
2. Architecture Verification (Target layer: CSS layer 1-7 or JS modules)
   ↓
3. Implementation (Maintain mandatory watermarks)
   ↓
4. Local Execution & Validation (Port 3000, console check, responsiveness)
   ↓
5. Post-validation check (Linting, FOUC check)
```

## Activation & Installation

### Option 1: Workspace Link (Recommended)
```bash
gemini skills link .agents/web-developer-lectura
gemini skills enable web-developer-lectura
```

### Option 2: Session Reload
After any modifications, perform a reload in the interactive session:
```
/skills reload
```
