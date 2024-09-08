import {PrismaClient} from '@prisma/client';

export class CategoryRepository {
  private prisma = new PrismaClient();

  async findAll() {
    return this.prisma.category.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        watches: false, 
      },
    });
  }

  async findDeleted() {
    return this.prisma.category.findMany({
      where: {
        isDeleted: true,
      },
      include: {
        watches: false, 
      },
    });
  }

  async findById(id: number) {
    return this.prisma.category.findUnique({
      where: {id},
      include: {
        watches: false,
      },
    });
  }

  async create(data: any) {
    return this.prisma.category.create({
      data: {
        ...data,
        watches: {
          connect: data.watchIds.map((watchId: number) => ({
            id: watchId,
          })),
        },
      },
    });
  }

  async update(id: number, data: any) {
    return this.prisma.category.update({
      where: {id},
      data: {
        ...data,
        watches: {
          set: data.watchIds.map((watchId: number) => ({
            id: watchId,
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