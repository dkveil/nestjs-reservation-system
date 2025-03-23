import { DatabaseService } from '../database.service';

export type FindManyOptions<T> = {
  filterQuery?: Partial<Record<keyof T, any>>;
  pagination?: {
    skip?: number;
    take?: number;
  };
  orderBy?: {
    [key: string]: 'asc' | 'desc';
  };
  include?: any;
};

export type FindOneOptions<T> = {
  filterQuery: Partial<Record<keyof T, any>>;
  include?: any;
};

export type CreateOptions<T> = {
  data: Partial<T>;
  include?: any;
};

export type UpdateOptions<T> = {
  filterQuery: Partial<Record<keyof T, any>>;
  data: Partial<T>;
  include?: any;
};

export type Pagination = {
  total: number;
  page: number;
  limit?: number;
  pages: number;
};

export type FilterQuery<T> = Partial<Record<keyof T, any>>;

export type IRepository<T extends { id: string }> = {
  create: (options: CreateOptions<T>) => Promise<T>;

  findAll: (include?: any) => Promise<T[]>;

  findMany: (options?: FindManyOptions<T>) => Promise<T[]>;

  findOne: (options: FindOneOptions<T>) => Promise<T | null>;

  findOneOrFail: (options: FindOneOptions<T>) => Promise<T>;

  update: (options: UpdateOptions<T>) => Promise<T>;

  remove: (filterQuery: Partial<Record<keyof T, any>>) => Promise<void>;

  softRemove: (filterQuery: Partial<Record<keyof T, any>>) => Promise<void>;

  restore: (filterQuery: Partial<Record<keyof T, any>>) => Promise<T>;

  transaction: <R>(callback: (db: DatabaseService) => Promise<R>) => Promise<R>;

  throwNotFoundException: (filterQuery: Partial<Record<keyof T, any>>) => never;
};
