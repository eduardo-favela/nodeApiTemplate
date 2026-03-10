/**
 * Standard API Response structure
 */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

/**
 * Pagination metadata interface
 */
export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Paginated API Response structure
 */
export interface PaginatedResponse<T> extends ApiResponse<T> {
  meta: PaginatedMeta;
}
