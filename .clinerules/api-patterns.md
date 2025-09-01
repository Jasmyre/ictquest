# API Design Rules

This document outlines the API design rules for the project.

## TRPC

- Use TRPC for all API endpoints.
- All procedures should use the `publicProcedure` wrapper.
- All procedures should return an `ApiResponse` type.

## Validation

- Use `zod` for all input validation.
- Standardize error messages: `invalid_type`, `too_small`, etc.
- Consistent schema naming: `[Entity]Schema` (e.g., `UserSchema`)

## Error Handling

- Centralized error logger in `src/lib/error.ts`
- All errors should be logged.
- All errors should be handled gracefully.

## ApiResponse Type

```typescript
type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
};
```