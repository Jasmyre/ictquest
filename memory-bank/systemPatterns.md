# System Patterns

## API Design Patterns
- All API endpoints use TRPC procedures
- Use `publicProcedure` wrapper for error handling
- Return `ApiResponse<T>` type for all procedures
- Validate all inputs using Zod schemas
- Centralized error logging in `src/lib/error.ts`

## UI Component Patterns
- Consistent prop names: `variant`, `size`, `disabled`
- Always include `className` prop for customization
- Use TypeScript interfaces for props
- Pass through unhandled props to underlying elements
- Use `cn` utility for class name composition

## Testing Patterns
- Jest as test runner
- React Testing Library for component tests
- MSW for API mocking
- Unit tests for utilities and hooks
- Integration tests for API routes
- Component snapshot tests
- Minimum test coverage: 80%
