# Agentic Developer Portal

An AI-native developer portal for managing repositories and dispatching autonomous coding agents. Browse repos, inspect health and activity, kick off agent tasks (refactors, security scans, dependency upgrades), and watch the agent reason and stream logs in real time.

Built with **React 18 + TypeScript + Vite**.

## Features

- **Repository List** — searchable, filterable grid of repos with health-at-a-glance cards.
- **Repository Overview** — bento-grid dashboard with language breakdown, commit activity, PR/issue counts, contributors, and last-deploy status.
- **Agent Execution** — dispatch a task to an AI agent and watch a live, three-channel feedback stream:
  - status badge (`pending → running → success | failure`)
  - discrete reasoning steps (Initialize → Analyze → Generate → Push)
  - streaming logs with auto-scroll and inspect-on-pause
- **Accessibility** — semantic HTML, keyboard navigation, `aria-live` log region, WCAG AAA contrast.
- **Dark-mode-first** glassmorphism UI tuned for long monitoring sessions.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check (`tsc -b`) and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Project structure

```
src/
├── App.tsx                       # View router (list → overview → execution)
├── components/
│   ├── shared/                   # Header / breadcrumb
│   ├── RepositoryList/           # Cards, search, filters
│   ├── RepositoryOverview/       # Insights panel, language breakdown
│   └── AgentExecution/           # Status, reasoning, streaming logs, details modal
├── hooks/useAgentExecution.ts    # Simulated streaming agent run
├── data/mockData.ts              # Mock repos and tasks
└── types/                        # Shared TypeScript types

docs/
├── ux-writeup.md                 # Design rationale (read this for the "why")
└── wireframes/                   # SVG wireframes for each view
```

## Design rationale

See [docs/ux-writeup.md](docs/ux-writeup.md) for the full UX brief — information architecture, progressive disclosure, real-time feedback design, accessibility, and tradeoffs.

## Status

This is a frontend prototype. All data is mocked and streaming is simulated with `setInterval`. A production version would wire to a real backend over Server-Sent Events or WebSockets and persist execution history.

## Author

Anvesh Navvathi
