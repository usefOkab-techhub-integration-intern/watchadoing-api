import { PrismaClient } from '@prisma/client';
import { UnifiedDTO } from '../dto/unified.dto';
import { NativeQuery } from './native.repository';
import { PageSortParams } from '../models/paging.sorting.model';
import { WatchCreation, WatchFilter, WatchUpdate } from '../models';
import { NotFoundError, InternalServerError } from '../utils/errors'; // Import custom errors

export class WatchRepository {
  private prisma = new PrismaClient();
  private dto = new UnifiedDTO();

  async findFiltered(
    pageSortParams: PageSortParams,
    filter?: WatchFilter
  ) {
    try {
      const { page, pageSize, sortBy, sortOrder } = pageSortParams;

      const watches = await this.prisma.watch.findMany({
        where: filter?.build(),
        include: {
          categories: {
            where: {
              isDeleted: false,
            },
          },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
          [sortBy]: sortOrder,
        },
      });

      return this.dto.mapWatchArray(watches);
    } catch (error) {
      console.error(`Failed to find filtered watches: ${error.message}`);
      throw new InternalServerError(`Failed to find filtered watches: ${error.message}`);
    }
  }

  async findDeleted(
    pageSortParams: PageSortParams
  ) {
    try {
      const { page, pageSize, sortBy, sortOrder } = pageSortParams;

      const watches = await this.prisma.watch.findMany({
        where: {
          isDeleted: true,
        },
        include: {
          categories: {
            where: {
              isDeleted: false,
            },
          },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
          [sortBy]: sortOrder,
        },
      });

      return this.dto.mapWatchArray(watches);
    } catch (error) {
      console.error(`Failed to find deleted watches: ${error.message}`);
      throw new InternalServerError(`Failed to find deleted watches: ${error.message}`);
    }
  }

  async findById(id: number) {
    try {
      const watch = await this.prisma.watch.findUnique({
        where: { id },
        include: {
          categories: true
        },
      });

      if (!watch) {
        throw new NotFoundError(`Watch with ID ${id} not found.`);
      }

      return {
        ...watch,
        categories: this.dto.mapCategoryArray(watch.categories)
      };
    } catch (error) {
      console.error(`Failed to find watch by ID: ${error.message}`);
      throw new InternalServerError(`Failed to find watch by ID: ${error.message}`);
    }
  }

  async bulkCreate(dataArray: WatchCreation[]) {
    try {
      const results = [];

      for (const data of dataArray) {
        const result = await this.prisma.watch.create({
          data: {
            ...data,
            categories: {
              connect: data.categories?.map((categoryId: number) => ({ id: categoryId })),
            },
          },
        });
        results.push(result);
      }

      return results;
    } catch (error) {
      console.error(`Failed to bulk create watches: ${error.message}`);
      throw new InternalServerError(`Failed to bulk create watches: ${error.message}`);
    }
  }

  async bulkUpdate(dataArray: WatchUpdate[]) {
    try {
      const results = [];

      for (const data of dataArray) {
        await this.prisma.$executeRawUnsafe(NativeQuery.disconnectCategoriesFromWatch(data.id));
        
        const result = await this.prisma.watch.update({
          where: { id: data.id },
          data: {
            ...data,
            categories: {
              connect: data.categories?.map((categoryId: number) => ({
                id: categoryId,
              })),
            },
          },
        });

        results.push(result);
      }

      return results;
    } catch (error) {
      console.error(`Failed to bulk update watches: ${error.message}`);
      throw new InternalServerError(`Failed to bulk update watches: ${error.message}`);
    }
  }

  async bulkSoftDelete(ids: number[]) {
    try {
      return this.prisma.watch.updateMany({
        where: {
          id: { in: ids },
        },
        data: { isDeleted: true },
      });
    } catch (error) {
      console.error(`Failed to bulk soft delete watches: ${error.message}`);
      throw new InternalServerError(`Failed to bulk soft delete watches: ${error.message}`);
    }
  }
}