import {PrismaClient} from '@prisma/client';

export class WatchRepository {
  private prisma = new PrismaClient();

  async findAll() {
    return this.prisma.watch.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        categories: true,
      },
    });
  }

  async findDeleted() {
    return this.prisma.watch.findMany({
      where: {
        isDeleted: true,
      },
      include: {
        categories: true,
      },
    });
  }

  async findById(id: number) {
    return this.prisma.watch.findUnique({
      where: {id},
      include: {
        categories: true,
      },
    });
  }

  async create(data: any) {
    return this.prisma.watch.create({
      data: {
        ...data,
        categories: {
          connect: data.categories.map((categoryId: number) => ({
            id: categoryId,
          })),
        },
      },
    });
  }

  async updateById(id: number, data: any) {
    return this.prisma.watch.update({
      where: {id},
      data: {
        ...data,
        categories: {
          connect: data.categories.map((categoryId: number) => ({
            id: categoryId,
          })),
        },
      },
    });
  }

  async softDeleteById(id: number) {
    return this.prisma.watch.update({
      where: {id},
      data: {isDeleted: true}, 
    });
  }
}