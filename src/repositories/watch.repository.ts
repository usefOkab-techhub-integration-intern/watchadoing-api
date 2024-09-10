import { PrismaClient } from '@prisma/client';
import { WatchDTO } from '../dto/watch.dto';
import { CategoryDTO } from '../dto/category.dto';

export class WatchRepository {
  private prisma = new PrismaClient();
  private categoryDTO = new CategoryDTO();
  private watchDTO = new WatchDTO(this.categoryDTO);

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
  
    return this.watchDTO.mapArray(watches);
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
  
    return this.watchDTO.mapArray(watches);
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
      categories: this.categoryDTO.mapArray(watch!.categories)
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