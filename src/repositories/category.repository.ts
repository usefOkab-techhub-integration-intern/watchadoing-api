import { PrismaClient } from '@prisma/client';
import { disconnectCategoryFromWatchesQuery } from './category.native.repository';

export class CategoryRepository {
  private prisma = new PrismaClient();

  async findAll() {
    const categories = await this.prisma.category.findMany({
      where: {
        isDeleted: false,
      }
    });

    return categories.map(category => {
      const { isDeleted, ...categoryRest } = category; 
      return categoryRest;
    });
  }

  async findDeleted() {
    const categories = await this.prisma.category.findMany({
      where: {
        isDeleted: true,
      }
    });

    return categories.map(category => {
      const { isDeleted, ...categoryRest } = category; 
      return categoryRest;
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
    await this.prisma.$executeRawUnsafe(disconnectCategoryFromWatchesQuery(ids));

    return this.prisma.category.updateMany({
      where: {
        id: { in: ids },
      },
      data: { isDeleted: true },
    });
  }
}