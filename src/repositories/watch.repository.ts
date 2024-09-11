import { PrismaClient } from '@prisma/client';
import { UnifiedDTO } from '../dto/unified.dto';
import { NativeQuery } from './native.repository';
import { PageSortParams } from '../models/paging.sorting.model';
import { WatchFilter } from '../models';

export class WatchRepository {
  private prisma = new PrismaClient();
  private dto = new UnifiedDTO();

  async findFiltered(
    pageSortParams : PageSortParams,
    filter? : WatchFilter
  ) {
    const {page, pageSize, sortBy, sortOrder} = pageSortParams
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
  }

  async findDeleted(
    pageSortParams : PageSortParams
  ) {
    const {page, pageSize, sortBy, sortOrder} = pageSortParams
  
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
  }

  async findById(id: number) {
    const watch = await this.prisma.watch.findUnique({
      where: { id },
      include: {
        categories: true
      },
    });

    return {
      ...watch,
      categories: this.dto.mapCategoryArray(watch!.categories)
    };
  }

async bulkCreate(dataArray: any[]) {
  const results = [];
  for (const data of dataArray) {
    const result = await this.prisma.watch.create({
      data: {
        ...data,
        categories: {
          connect: data.categories.map((categoryId: number) => ({ id: categoryId })),
        },
      },
    });
    results.push(result);
  }
  return results;
}

async bulkUpdate(dataArray: any[]) {
  const results = [];
  for (const data of dataArray) {
    await this.prisma.$executeRawUnsafe(NativeQuery.disconnectCategoriesFromWatch(data.id));
    
    const result = await this.prisma.watch.update({
      where: { id: data.id },
      data: {
        ...data,
        categories: {
          connect: data.categories.map((categoryId: number) => ({
            id: categoryId,
          })),
        },
      },
    });
    results.push(result);
  }
  return results;
}

  async bulkSoftDelete(ids: number[]) {
    return this.prisma.watch.updateMany({
      where: {
        id: { in: ids },
      },
      data: { isDeleted: true },
    });
  }
}