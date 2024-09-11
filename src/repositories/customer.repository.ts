import { PrismaClient } from '@prisma/client';
import { CustomerDTO } from '../dto/customer.dto';
import { CustomerNativeRepository } from './customer.native.repository';

export class CustomerRepository {
  private prisma = new PrismaClient();
  private native = new CustomerNativeRepository(this.prisma);
  private dto = new CustomerDTO();

  async findAll(
    page: number = 1,
    pageSize: number = 10,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ) {
    const customers = await this.prisma.customer.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        orders: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });
    return this.dto.mapArray(customers);
  }

  async findDeleted(
    page: number = 1,
    pageSize: number = 10,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ) {
    const customers = await this.prisma.customer.findMany({
      where: {
        isDeleted: true,
      },
      include: {
        orders: true, 
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    return this.dto.mapArray(customers);
  }

  async findById(id: number) {
    return this.prisma.customer.findUnique({
      where: { id },
      include: {
        orders: true, 
      },
    });
  }

  async bulkCreate(dataArray: any[]) {
    const results = [];
    for (const data of dataArray) {
      const result = await this.prisma.customer.create({
        data: data,
      });
      results.push(result);
    }
    return results;
  }

  async bulkUpdate(dataArray: any[]) {
    const results = [];
    for (const data of dataArray) {
      const result = await this.prisma.customer.update({
        where: { id: data.id },
        data: data,
      });
      results.push(result);
    }
    return results;
  }

  async bulkSoftDelete(ids: number[]) {  
    await this.native.deleteAllOrderData(ids);

    return this.prisma.customer.updateMany({
      where: {
        id: { in: ids },
      },
      data: { isDeleted: true },
    });
  }
}