export interface MoleculerList<T> {
  rows: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface MoleculerListOptions {
  populate?: string;
  fields?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
  search?: string;
  searchFields?: string;
}

export interface MoleculerGetOptions {
  populate?: string;
  fields?: string;
  mapping?: boolean;
}

export type MoleculerFind<T> = T[];

export interface MoleculerFindOptions {
  populate?: string;
  fields?: string;
  limit?: number;
  offset?: number;
  sort?: string;
  search?: string;
  searchFields?: string;
}
