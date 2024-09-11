import { PrismaClient } from '@prisma/client';
import { UnifiedDTO } from '../dto/unified.dto';

export class WatchRepository {
  private prisma = new PrismaClient();
  private dto = new UnifiedDTO();

  async findFiltered(
    filter: any,
    page: number = 1,
    pageSize: number = 10,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ) {
    const whereClause: any = { isDeleted: false };
  
    if (filter) {
      if (filter.model) {
        whereClause.model = { contains: filter.model};
      }
  
      if (filter.origin) {
        whereClause.origin = { contains: filter.origin};
      }
  
      if (filter.sn) {
        whereClause.sn = { contains: filter.sn};
      }
  
      if (filter.category) {
        whereClause.categories = { 
          some: { 
            id: filter.category, 
            isDeleted: false 
          } 
        };
      }
    }
  
    const watches = await this.prisma.watch.findMany({
      where: whereClause,
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
      page: number = 1,
      pageSize: number = 10,
      sortBy: string = 'createdAt',
      sortOrder: 'asc' | 'desc' = 'desc'
  ) {
  
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