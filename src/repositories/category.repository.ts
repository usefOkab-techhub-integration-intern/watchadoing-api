import { PrismaClient } from '@prisma/client';
import { CategoryNativeRepository } from './category.native.repository';
import { CategoryDTO } from '../dto/category.dto';

export class CategoryRepository {
  private prisma = new PrismaClient();
  private native = new CategoryNativeRepository(this.prisma);
  private dto = new CategoryDTO();

  async findAll(
    page: number = 1,
    pageSize: number = 10,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ) {
    const categories = await this.prisma.category.findMany({
      where: {
        isDeleted: false,
      },
      skip: (page - 1) * pageSize,  
      take: pageSize,
      orderBy: {
        [sortBy]: sortOrder, 
      },
    });
    return this.dto.mapArray(categories);
  }

  async findDeleted(
    page: number = 1,
    pageSize: number = 10,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ) {
    const categories = await this.prisma.category.findMany({
      where: {
        isDeleted: true,
      },
      skip: (page - 1) * pageSize,  
      take: pageSize,
      orderBy: {
        [sortBy]: sortOrder, 
      },
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