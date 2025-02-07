import { DatabaseService } from '../database.service';

export interface IRepository<T extends { id: string }> {
	create(data: Partial<T>, include?: any): Promise<T>;

	findAll(include?: any): Promise<T[]>;

	findMany(
		filterQuery?: Partial<Record<keyof T, any>>,
		paginationQuery?: {
			skip?: number;
			take?: number;
		},
		include?: any
	): Promise<T[]>;

	findOne(filterQuery: Partial<Record<keyof T, any>>, include?: any): Promise<T | null>;

	findOneOrFail(filterQuery: Partial<Record<keyof T, any>>, include?: any): Promise<T>;

	update(filterQuery: Partial<Record<keyof T, any>>, data: Partial<T>, include?: any): Promise<T>;

	remove(filterQuery: Partial<Record<keyof T, any>>): Promise<void>;

	softRemove(filterQuery: Partial<Record<keyof T, any>>): Promise<void>;

	restore(filterQuery: Partial<Record<keyof T, any>>): Promise<T>;

	transaction<R>(callback: (db: DatabaseService) => Promise<R>): Promise<R>;

	throwNotFoundException(filterQuery: Partial<Record<keyof T, any>>): never;
}
