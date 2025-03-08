import { FlattenMaps, Types } from 'mongoose';

export interface PopulateObject {
  path: string;
  select?: string | string | Record<string, 1 | -1>;
}

export interface MongoDbFindOptions<T = any> {
  filter?: T;
  select?: string | Record<string, 1 | 0>;
  sort?: string | Record<string, 1 | -1>;
  populate?: PopulateObject[];
  limit?: number;
  page?: number;
  pagination?: boolean;
}

export interface MongoDbFindOneOptions {
  select?: string | Record<string, 1 | 0>;
  sort?: string | Record<string, 1 | -1>;
  populate?: PopulateObject[];
}

export interface FindPaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    to: number;
  };
}

export interface PaginationData {
  total: number;
  current_page: number;
  to: number;
  per_page: number;
}
export interface PaginatedResult<T = any> {
  pagination: PaginationData;
  data: T[];
}

export type PromisePaginatedResult<T = any> = Promise<PaginatedResult<T>>;

export type MongoWatchEvent<T> = {
  _id: { _data: string };
  fullDocument: FlattenMaps<T>;
  documentKey: { _id: Types.ObjectId };
  operationType: string;
};

export type OperationType = 'create' | 'update' | 'delete';
