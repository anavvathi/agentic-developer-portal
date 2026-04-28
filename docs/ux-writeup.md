# Agentic Developer Portal — UX Writeup

A short brief explaining the design rationale for the AI-native developer portal. This document complements the four wireframes in [`docs/wireframes/`](./wireframes/) and the live React + TypeScript implementation under [`src/`](../src/).

---

## 1. Problem framing

Developers juggle dozens of repositories and increasingly delegate work — refactors, security scans, PR creation — to AI agents. Today, this work happens across CLI, GitHub UI, ad-hoc dashboards, and Slack threads. The portal exists to:

1. **Centralize** repository status and health in one view,
2. **Make agent dispatch trivial** ("run a task on this repo, in two clicks"),
3. **Expose what the agent is doing in real time** so developers can trust and intervene.

These three goals shaped every UX decision below.

---

## 2. Information architecture: left-to-right drill-down

The portal uses a strict three-level flow:

```
[ List ]  →  [ Overview ]  →  [ Execution ]
```

- **List** — broad survey of every repo. Optimized for *finding* the right one.
- **Overview** — focused inspection of one repo. Optimized for *deciding* what to do next.
- **Execution** — single-purpose monitoring of an active agent run. Optimized for *trust*.

Each level has one primary call to action that leads to the next ("open repo" → "run agent task" → "watch logs"). The breadcrumb in the [`Header`](../src/components/shared/Header.tsx) lets users back-step without losing context.

**Why not a single dense dashboard?** Agent execution is high-cognitive-load — streaming logs, live status, reasoning steps. Overloading it with the repo list would compete for attention. Splitting the flow lets each screen breathe.

---

## 3. Progressive disclosure

The portal surfaces top-level KPIs first, then exposes detail on demand:

| Layer | What's shown | Where |
|---|---|---|
| **Glance** | Repo name, description, primary language, health score | [`RepositoryCard`](../src/components/RepositoryList/RepositoryCard.tsx) |
| **Survey** | Bento-grid: language breakdown, commit activity, PR/issue counts, contributors, last deploy | [`InsightsPanel`](../src/components/RepositoryOverview/InsightsPanel.tsx) |
| **Detail** | Full execution metadata: ID, model, token usage, JSON config | [`DetailsModal`](../src/components/AgentExecution/DetailsModal.tsx) |

Repository cards intentionally show *only* what helps a user decide which repo to open. The bento grid on Overview answers "is this repo healthy?" without scrolling. The Details modal exists for power users who want execution-level debugging.

---

## 4. Real-time feedback reduces developer anxiety

When an AI agent operates on your code, silence is anxiety-inducing. The Agent Execution panel addresses this with three layered feedback channels, each operating on a different rhythm:

1. **Status badge** (low-frequency) — single source of truth: `pending → running → success | failure`. Animated icons reinforce state changes (spin during running, pulse during pending).
2. **Reasoning steps** (medium-frequency) — discrete checkpoints (e.g. *Initialize → Analyze → Generate → Push*). Tells users *where* in the task we are.
3. **Streaming logs** (high-frequency) — emit every 200–600ms via [`useAgentExecution`](../src/hooks/useAgentExecution.ts). Tells users *exactly what* the agent just did.

Auto-scroll is enabled by default but disengages if the user scrolls up — a small detail, but critical: forced auto-scroll prevents inspection. The "live" indicator is kept distinct from the level tags so users can see the stream is alive even between log lines (cursor blink).

**Failure path matters as much as the success path.** When `status === 'failure'`, a retry button appears prominently with an explanation, and color-coded ERROR logs are easy to spot. This converts a dead-end into a recoverable action.

---

## 5. Accessibility

- **Color is never the sole signal**: every status uses both an icon and a text label (e.g. ✓ Success, ✗ Failed). Log levels use both a colored tag and the level name.
- **Contrast**: Body text on background (`#f1f5f9` on `#060a14`) exceeds WCAG AAA (≥7:1). Muted secondary text (`#94a3b8`) is used only for non-essential metadata.
- **Keyboard navigation**: All cards, chips, and modal triggers are real `<button>` elements (focusable, keyboard-activatable). The Details modal closes on `Escape`.
- **Semantic HTML & ARIA**: Streaming logs use `role="log"` with `aria-live="polite"` so screen readers announce new entries without interrupting. Modal uses `role="dialog"` + `aria-modal`. Health rings expose numeric values via `aria-label`.
- **Motion**: Animations are short (≤500ms) and use easing curves; the design respects users who reduce motion via the OS by avoiding parallax and large translates.

---

## 6. Visual language

- **Dark-mode-first** matches developer environments and reduces eye strain during long monitoring sessions.
- **Glassmorphism + radial gradients** (see [`index.css`](../src/index.css)) create depth without skeuomorphism, signaling that this is modern, AI-era tooling.
- **Bento layout** on the Overview pages communicates "a collection of related metrics" better than a uniform grid. Variable card sizes draw the eye to the most important information (language breakdown and commit activity get the most space).
- **Indigo + violet accents** for primary actions, with status-specific greens, ambers, and reds. Reserving indigo strictly for "go" actions makes the CTA unambiguous.
- **Typography**: Inter for UI clarity, JetBrains Mono for logs and code — the typographic distinction reinforces "this is human-readable" vs. "this is machine output."

---

## 7. Tradeoffs & next steps

- **No real backend**: All data is mocked in [`mockData.ts`](../src/data/mockData.ts). Streaming is simulated with `setInterval`. A production version would use Server-Sent Events or WebSockets.
- **No persistent state**: Refreshing during execution loses progress. A real implementation would persist execution history per-repo so users can return to past runs.
- **No multi-agent orchestration yet**: Currently one task per execution. A natural next step is parallel agent dispatch (e.g., security scan + dependency upgrade simultaneously).
