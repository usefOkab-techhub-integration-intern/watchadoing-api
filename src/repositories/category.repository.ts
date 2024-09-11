import { PrismaClient } from '@prisma/client';
import { UnifiedDTO } from '../dto/unified.dto';
import { NativeQuery } from './native.repository';
import { PageSortParams } from '../models/paging.sorting.model';
import { CategoryCreation, CategoryUpdate } from '../models';

export class CategoryRepository {
  private prisma = new PrismaClient();
  private dto = new UnifiedDTO();

  async findAll(
    pageSortParams : PageSortParams
  ) {
    const {page, pageSize, sortBy, sortOrder} = pageSortParams
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
  }

  async findDeleted(
    pageSortParams : PageSortParams
  ) {
    const {page, pageSize, sortBy, sortOrder} = pageSortParams
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
  }

  async findById(id: number) {
    return this.prisma.category.findUnique({
      where: { id }
    });
  }

  async bulkCreate(dataArray: CategoryCreation[]) {
    const results = [];
    for (const data of dataArray) {
      const result = await this.prisma.category.create({
        data: data,
      });
      results.push(result);
    }
    return results;
  }

  async bulkUpdate(dataArray: CategoryUpdate[]) {
    const results = [];
    for (const data of dataArray) {
      const result = await this.prisma.category.update({
        where: { id: data.id },
        data: data,
      });
      results.push(result);
    }
    return results;
  }

  async bulkSoftDelete(ids: number[]) {  
    await this.prisma.$executeRawUnsafe(NativeQuery.disconnectWatchesFromCategories(ids));

    return this.prisma.category.updateMany({
      where: {
        id: { in: ids },
      },
      data: { isDeleted: true },
    });
  }
}