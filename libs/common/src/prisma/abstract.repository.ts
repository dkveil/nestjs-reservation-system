import { NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';

export abstract class AbstractRepository<T extends { id: number | string }> {
  protected abstract readonly prisma: PrismaService;
  protected abstract get model(): any;

  private throwNotFoundException(filterQuery: Partial<Record<keyof T, any>>): never {
    const errorMessage = `Entity with filter ${JSON.stringify(filterQuery)} not found`;

    this.prisma.log('error', errorMessage);
    throw new NotFoundException(errorMessage);
  }

  async create(data: Partial<T>): Promise<T> {
    const created = await this.model.create({ data });

    this.prisma.log('info', 'Entity created', created);
    return created;
  }

  async findAll(): Promise<T[]> {
    const found = await this.model.findMany();

    this.prisma.log('info', 'Entities found', found);
    return found;
  }

  async findMany(
    filterQuery: Partial<Record<keyof T, any>> = {},
    paginationQuery: { skip?: number; take?: number } = {},
  ): Promise<T[]> {
    const { skip, take } = paginationQuery;
    const found = await this.model.findMany({
      where: filterQuery,
      skip,
      take,
    });

    this.prisma.log('info', 'Entities found', found);
    return found;
  }

  async findOne(filterQuery: Partial<Record<keyof T, any>>): Promise<T | null> {
    const result = await this.model.findUnique({ where: filterQuery });

    if (!result) {
      this.throwNotFoundException(filterQuery);
    }

    return result;
  }

  async findOneOrFail(filterQuery: Partial<Record<keyof T, any>>): Promise<T> {
    const result = await this.findOne(filterQuery);

    if (!result) {
      this.throwNotFoundException(filterQuery);
    }

    return result;
  }

  async update(filterQuery: Partial<Record<keyof T, any>>, data: Partial<T>): Promise<T> {
    const result = await this.model.findUnique({ where: filterQuery });

    if (!result) {
      this.throwNotFoundException(filterQuery);
    }

    const updated = await this.model.update({
      where: filterQuery,
      data,
    });

    this.prisma.log('info', 'Entity updated', updated);
    return updated;
  }

  async remove(filterQuery: Partial<Record<keyof T, any>>): Promise<void> {
    const result = await this.model.findUnique({ where: filterQuery });

    if (!result) {
      this.throwNotFoundException(filterQuery);
    }

    const deleted = await this.model.delete({ where: filterQuery });

    this.prisma.log('info', 'Entity deleted', deleted);
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

    this.prisma.log('info', 'Entity soft deleted', deleted);
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

    this.prisma.log('info', 'Entity restored', restored);
    return restored;
  }

  async transaction<R>(callback: (prisma: PrismaService) => Promise<R>): Promise<R> {
    return this.prisma.$transaction(callback);
  }
}
