import { PrismaClient } from '@prisma/client';

export class CategoryRepository {
  private prisma = new PrismaClient();

  async findAll() {
    return this.prisma.category.findMany({
      where: {
        isDeleted: false,
      }
    });
  }

  async findDeleted() {
    return this.prisma.category.findMany({
      where: {
        isDeleted: true,
      }
    });
  }

  async findById(id: number) {
    return this.prisma.category.findUnique({
      where: { id }
    });
  }

  async bulkCreate(dataArray: any[]) {
    const results = [];
    for (const data of dataArray) {
      const result = await this.prisma.category.create({
        data: data,
      });
      results.push(result);
    }
    return results;
  }

  async bulkUpdate(dataArray: any[]) {
    const results = [];
    for (const data of dataArray) {
      const result = await this.prisma.category.create({
        data: data,
      });
      results.push(result);
    }
    return results;
  }

  async bulkSoftDelete(ids: number[]) {
    return this.prisma.category.updateMany({
      where: {
        id: { in: ids },
      },
      data: { isDeleted: true },
    });
  }
}