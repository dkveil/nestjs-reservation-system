import { NotFoundException } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { IRepository, FindManyOptions, FindOneOptions, CreateOptions, UpdateOptions } from './interfaces/';

export abstract class AbstractRepository<T extends { id: string }> implements IRepository<T> {
	protected readonly db: DatabaseService;
	protected abstract get model(): any;
	protected abstract get repositoryName(): string;

	constructor(db: DatabaseService) {
		this.db = db;
	}

	public throwNotFoundException(filterQuery: Partial<Record<keyof T, any>>): never {
		const errorMessage = `${this.repositoryName}: Entity with filter ${JSON.stringify(filterQuery)} not found`;

		this.db.log('error', errorMessage);
		throw new NotFoundException(errorMessage);
	}

	async create(options: CreateOptions<T>): Promise<T> {
		const { data, include } = options;
		const created = await this.model.create({ data }, include);

		this.db.log('info', `${this.repositoryName}: Entity created`, created);
		return created;
	}

	async findAll(include?: any): Promise<T[]> {
		const found = await this.model.findMany({ include });

		this.db.log('info', `${this.repositoryName}: Entities found`, found);
		return found;
	}

	async findMany(options: FindManyOptions<T> = {}): Promise<T[]> {
		const { filterQuery = {}, pagination = {}, include } = options;
		const { skip, take } = pagination;

		const found = await this.model.findMany({
			where: filterQuery,
			skip,
			take,
			include,
		});

		this.db.log('info', `${this.repositoryName}: Entities found`, found);
		return found;
	}

	async findOne(options: FindOneOptions<T>): Promise<T | null> {
		const { filterQuery, include } = options;

		const result = await this.model.findUnique({
			where: filterQuery,
			include,
		});

		if (!result) {
			this.throwNotFoundException(filterQuery);
		}

		return result;
	}

	async findOneOrFail(options: FindOneOptions<T>): Promise<T> {
		const result = await this.findOne(options);

		if (!result) {
			this.throwNotFoundException(options.filterQuery);
		}

		return result;
	}

	async update(options: UpdateOptions<T>): Promise<T> {
		const { filterQuery, data, include } = options;
		const result = await this.model.findUnique({ where: filterQuery });

		if (!result) {
			this.throwNotFoundException(filterQuery);
		}

		const updated = await this.model.update({
			where: filterQuery,
			data,
			include,
		});

		this.db.log('info', `${this.repositoryName}: Entity updated`, updated);
		return updated;
	}

	async remove(filterQuery: Partial<Record<keyof T, any>>): Promise<void> {
		const result = await this.model.findUnique({ where: filterQuery });

		if (!result) {
			this.throwNotFoundException(filterQuery);
		}

		const deleted = await this.model.delete({ where: filterQuery });

		this.db.log('info', `${this.repositoryName}: Entity deleted`, deleted);
	}

	async softRemove(filterQuery: Partial<Record<keyof T, any>>): Promise<void> {
		const result = await this.model.findUnique({ where: filterQuery });

		if (!result) {
			this.throwNotFoundException(filterQuery);
		}

		const deleted = await this.model.update({
			where: filterQuery,
			data: { deletedAt: new Date() },
		});

		this.db.log('info', `${this.repositoryName}: Entity soft deleted`, deleted);
	}

	async restore(filterQuery: Partial<Record<keyof T, any>>): Promise<T> {
		const result = await this.model.findUnique({ where: filterQuery });

		if (!result) {
			this.throwNotFoundException(filterQuery);
		}

		const restored = await this.model.update({
			where: filterQuery,
			data: { deletedAt: null },
		});

		this.db.log('info', `${this.repositoryName}: Entity restored`, restored);
		return restored;
	}

	async transaction<R>(callback: (db: DatabaseService) => Promise<R>): Promise<R> {
		return this.db.$transaction(callback);
	}
}
