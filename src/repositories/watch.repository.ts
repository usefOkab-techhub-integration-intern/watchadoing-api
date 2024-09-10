import { PrismaClient } from '@prisma/client';

export class WatchRepository {
  private prisma = new PrismaClient();

  async findFiltered(filter: any) {
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
    });
  
    return watches.map(watch => {
      const { isDeleted, ...rest } = watch;
      return {
        ...rest,
        categories: watch.categories.map(category => {
          const { isDeleted, ...categoryRest } = category; 
          return categoryRest;
        }),
      };
    });
  }

  async findDeleted() {
    const watches = await this.prisma.watch.findMany({
      where: {
        isDeleted: true,
      },
      include: {
        categories: true,
      },
    });
    
    return watches.map(watch => {
      const { isDeleted, ...rest } = watch;
      return {
        ...rest,
        categories: watch.categories.map(category => {
          const { isDeleted, ...categoryRest } = category; 
          return categoryRest;
        }),
      };
    });
  }

  async findById(id: number) {
    const watch = await this.prisma.watch.findUnique({
      where: { id },
      include: {
        categories: true
      },
    });

    watch?.categories.map(category => {
        const { isDeleted, ...categoryRest } = category; 
        return categoryRest;
      });
    return watch;
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