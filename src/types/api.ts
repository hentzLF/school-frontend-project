export type ApiErrorResponse = {
  message: string;
  errors?: Record<string, string[]>;
};

export type PaginatedResponse<T> = {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
