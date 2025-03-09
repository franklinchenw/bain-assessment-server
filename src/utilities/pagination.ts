import { OrderByDirection } from "objection";

/**
 * Pagination constants
 */
export const ASC = "asc";
export const DESC = "desc";

/**
 * Default pagination
 */
export const DEFAULT_PAGINATION: PaginationParams = {
  offset: 0,
  limit: 100,
  order: DESC,
  orderBy: "created_at",
  order2: DESC,
  orderBy2: "updated_at",
};

export interface PaginationParams {
  offset: number;
  limit: number;
  order: OrderByDirection;
  orderBy: string;
  order2: OrderByDirection;
  orderBy2: string;
}

/**
 * Create pagination
 */
export const createPagination = (params: PaginationParams): PaginationParams => {
  if (params.offset && params.offset < 0) {
    throw new Error("Offset must be non-negative");
  }

  if (params.limit && params.limit <= 0) {
    throw new Error("Limit must be positive");
  }

  if (params.order && params.order !== ASC && params.order !== DESC) {
    throw new Error("Order must be either 'asc' or 'desc'");
  }

  if (params.order2 && params.order2 !== ASC && params.order2 !== DESC) {
    throw new Error("Order2 must be either 'asc' or 'desc'");
  }

  if (params.orderBy && params.orderBy !== ASC && params.orderBy !== DESC) {
    throw new Error("OrderBy must be either 'asc' or 'desc'");
  }

  if (params.orderBy2 && params.orderBy2 !== ASC && params.orderBy2 !== DESC) {
    throw new Error("OrderBy2 must be either 'asc' or 'desc'");
  }

  return {
    offset: params.offset || DEFAULT_PAGINATION.offset,
    limit: params.limit || DEFAULT_PAGINATION.limit,
    order: params.order || DEFAULT_PAGINATION.order,
    orderBy: params.orderBy || DEFAULT_PAGINATION.orderBy,
    order2: params.order2 || DEFAULT_PAGINATION.order2,
    orderBy2: params.orderBy2 || DEFAULT_PAGINATION.orderBy2,
  };
};
