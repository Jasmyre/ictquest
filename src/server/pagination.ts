/**
 * Shared pagination shape (code-review Standards fix).
 *
 * The same `{ skip ?? 0, take ?? 20 }` pair travelled together through
 * every list service (`achievement`, `admin`, `progress`, `lesson`). It is
 * bundled here so each service passes one `Pagination` instead of two
 * loosely-typed primitives (Data Clumps / Primitive Obsession baseline).
 */

export type Pagination = {
  skip: number;
  take: number;
};

export type PaginationInput = {
  skip?: number;
  take?: number;
};

const DEFAULT_SKIP = 0;
const DEFAULT_TAKE = 20;

export function pickPagination(input: PaginationInput): Pagination {
  return {
    skip: input.skip ?? DEFAULT_SKIP,
    take: input.take ?? DEFAULT_TAKE,
  };
}
