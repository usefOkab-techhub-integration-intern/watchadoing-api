import { PrismaClient } from '@prisma/client';
import { UnifiedDTO } from '../dto/unified.dto';
import { NativeQuery } from './native.repository';
import { PageSortParams } from '../models/paging.sorting.model';
import { CategoryCreation, CategoryUpdate } from '../models';
import { NotFoundError, InternalServerError } from '../utils/errors'; // Import custom errors

export class CategoryRepository {
  private prisma = new PrismaClient();
  private dto = new UnifiedDTO();

  async findAll(pageSortParams: PageSortParams) {
    try {
      const { page, pageSize, sortBy, sortOrder } = pageSortParams;
      const categories = await this.prisma.category.findMany({
        where: {
          isDeleted: false,
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
          [sortBy]: sortOrder,
        },
      });
      return this.dto.mapCategoryArray(categories);
    } catch (error) {
      console.error(`Failed to fetch categories: ${error.message}`);
      throw new InternalServerError(`Failed to fetch categories: ${error.message}`);
    }
  }

  async findDeleted(pageSortParams: PageSortParams) {
    try {
      const { page, pageSize, sortBy, sortOrder } = pageSortParams;
      const categories = await this.prisma.category.findMany({
        where: {
          isDeleted: true,
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
          [sortBy]: sortOrder,
        },
      });
      return this.dto.mapCategoryArray(categories);
    } catch (error) {
      console.error(`Failed to fetch deleted categories: ${error.message}`);
      throw new InternalServerError(`Failed to fetch deleted categories: ${error.message}`);
    }
  }

  async findById(id: number) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id }
      });
      if (!category) {
        throw new NotFoundError('Category not found');
      }
      return category;
    } catch (error) {
      console.error(`Failed to fetch category by ID: ${error.message}`);
      throw new InternalServerError(`Failed to fetch category by ID: ${error.message}`);
    }
  }

  async bulkCreate(dataArray: CategoryCreation[]) {
    try {
      const results = [];
      for (const data of dataArray) {
        const result = await this.prisma.category.create({
          data: data,
        });
        results.push(result);
      }
      return results;
    } catch (error) {
      console.error(`Failed to bulk create categories: ${error.message}`);
      throw new InternalServerError(`Failed to bulk create categories: ${error.message}`);
    }
  }

  async bulkUpdate(dataArray: CategoryUpdate[]) {
    try {
      const results = [];
      for (const data of dataArray) {
        const result = await this.prisma.category.update({
          where: { id: data.id },
          data: data,
        });
        results.push(result);
      }
      return results;
    } catch (error) {
      console.error(`Failed to bulk update categories: ${error.message}`);
      throw new InternalServerError(`Failed to bulk update categories: ${error.message}`);
    }
  }

  async bulkSoftDelete(ids: number[]) {
    try {
      await this.prisma.$executeRawUnsafe(NativeQuery.disconnectWatchesFromCategories(ids));

      return this.prisma.category.updateMany({
        where: {
          id: { in: ids },
        },
        data: { isDeleted: true },
      });
    } catch (error) {
      console.error(`Failed to bulk soft delete categories: ${error.message}`);
      throw new InternalServerError(`Failed to bulk soft delete categories: ${error.message}`);
    }
  }
}