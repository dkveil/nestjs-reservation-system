import { DatabaseService } from '../database.service';

export interface FindManyOptions<T> {
	filterQuery?: Partial<Record<keyof T, any>>;
	pagination?: {
		skip?: number;
		take?: number;
	};
	orderBy?: {
		[key: string]: 'asc' | 'desc';
	};
	include?: any;
}

export interface FindOneOptions<T> {
	filterQuery: Partial<Record<keyof T, any>>;
	include?: any;
}

export interface CreateOptions<T> {
	data: Partial<T>;
	include?: any;
}

export interface UpdateOptions<T> {
	filterQuery: Partial<Record<keyof T, any>>;
	data: Partial<T>;
	include?: any;
}

export interface Pagination {
	total: number;
	page: number;
	limit?: number;
	pages: number;
}

export type FilterQuery<T> = Partial<Record<keyof T, any>>;

export interface IRepository<T extends { id: string }> {
	create(options: CreateOptions<T>): Promise<T>;

	findAll(include?: any): Promise<T[]>;

	findMany(options?: FindManyOptions<T>): Promise<T[]>;

	findOne(options: FindOneOptions<T>): Promise<T | null>;

	findOneOrFail(options: FindOneOptions<T>): Promise<T>;

	update(options: UpdateOptions<T>): Promise<T>;

	remove(filterQuery: Partial<Record<keyof T, any>>): Promise<void>;

	softRemove(filterQuery: Partial<Record<keyof T, any>>): Promise<void>;

	restore(filterQuery: Partial<Record<keyof T, any>>): Promise<T>;

	transaction<R>(callback: (db: DatabaseService) => Promise<R>): Promise<R>;

	throwNotFoundException(filterQuery: Partial<Record<keyof T, any>>): never;
}
