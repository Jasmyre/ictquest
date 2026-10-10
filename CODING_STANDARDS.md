# Coding Standards

Review-time judgement standards only. Mechanical rules live in the Biome/Ultracite config and are never restated here. See `CONTEXT.md` (Standards language) for the `mechanical rule` vs `judgement standard` definitions.

## Layering

- Keep responsibilities in their tier per `memory-bank/systemPatterns.md` (Presentation → Controller → Business Logic → Data Access). Controllers stay thin; business rules live in `src/server/services`; persistence lives in `src/server/repositories`.
- The only sanctioned layering exceptions are the two documented in `memory-bank/systemPatterns.md`: the dashboard visibility-scoping exception and the self-demotion exception. Do not invent new exceptions without an ADR.

## Cross-file consistency

- Match the surrounding module's established patterns (naming, error shape, result codes) over generic preference. When two local patterns conflict, follow the newer ADR or `systemPatterns.md`, and note the conflict in your review output.
