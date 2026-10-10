# Agent Guide

## Standards

- Mechanical rules are enforced by `npm exec -- ultracite check` (fix with `npm exec -- ultracite fix`). Verify with `npm run typecheck` and `npm run test:all`. Do not restate mechanical rules in markdown.
- Judgement standards live in `CODING_STANDARDS.md` — read it at review time only.

This project is released: write production-ready logic and design only — no placeholder identity, data, or dead UI in committed code. Every merged surface resolves real session/data state plus loading/empty states.

## Memory Bank

- Before you start: read `memory-bank/activeContext.md` and `memory-bank/systemPatterns.md` (Presentation → Controller → Business Logic → Data Access; controllers never reach past the next tier).
- After you finish: update `memory-bank/activeContext.md` and `memory-bank/progress.md`; update `memory-bank/systemPatterns.md` only if architecture, component structure, or runtime flow changed.

## Domain & Workflow

- Domain language: `CONTEXT.md`. Architecture decisions: `docs/adr/`. Skill usage: `docs/agents/domain.md`.
- Issues: GitHub Issues in `Jasmyre/nextjs16-t3-template` via `gh`. See `docs/agents/issue-tracker.md` and `docs/agents/triage-labels.md`.
