import { PrismaClient } from '@prisma/client';
import { CategoryNativeRepository } from './category.native.repository';
import { CategoryDTO } from '../dto/category.dto';

export class CategoryRepository {
  private prisma = new PrismaClient();
  private native = new CategoryNativeRepository(this.prisma);
  private dto = new CategoryDTO();

  async findAll() {
    const categories = await this.prisma.category.findMany({
      where: {
        isDeleted: false,
      }
    });

    return this.dto.mapArray(categories);
  }

  async findDeleted() {
    const categories = await this.prisma.category.findMany({
      where: {
        isDeleted: true,
      }
    });

    return this.dto.mapArray(categories);
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
    await this.native.disconnectCategories(ids);

    return this.prisma.category.updateMany({
      where: {
        id: { in: ids },
      },
      data: { isDeleted: true },
    });
  }
}