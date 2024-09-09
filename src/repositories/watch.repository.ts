import { PrismaClient } from '@prisma/client';

export class WatchRepository {
  private prisma = new PrismaClient();

  async findAll() {
    return this.prisma.watch.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        categories: true
      },
    });
  }

  async findDeleted() {
    return this.prisma.watch.findMany({
      where: {
        isDeleted: true,
      },
      include: {
        categories: true
      },
    });
  }

  async findById(id: number) {
    return this.prisma.watch.findUnique({
      where: { id },
      include: {
        categories: true
      },
    });
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