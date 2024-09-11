import { PrismaClient } from '@prisma/client';
import { UnifiedDTO } from '../dto/unified.dto';
import { NativeQuery } from './native.repository';

export class CustomerRepository {
  private prisma = new PrismaClient();
  private dto = new UnifiedDTO();

  async findFiltered(
    page: number = 1,
    pageSize: number = 10,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
    filter: any
  ) {
    const whereClause: any = { isDeleted: false };
    if (filter && filter.name) {
        whereClause.name = { contains: filter.name };
    }
    const customers = await this.prisma.customer.findMany({
      where: whereClause,
      include: {
        orders: {
          include: {
            shipment: true,
            orderLines: {
              include: {
                watch: {
                  include: {
                    categories: true
                  }
                }
              }
            }
          }
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });
    return this.dto.mapCustomerArray(customers);
  }

  async findDeleted(
    page: number = 1,
    pageSize: number = 10,
    sortBy: string = 'addedAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ) {
    const customers = await this.prisma.customer.findMany({
      where: {
        isDeleted: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    return this.dto.mapCustomerArray(customers);
  }

  async findById(id: number) {
    return this.prisma.customer.findUnique({
      where: { id },
      include: {
        orders: {
          include: {
            shipment: true,
            orderLines: {
              include: {
                watch: {
                  include: {
                    categories: true
                  }
                }
              }
            }
          }
        },
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
    await this.prisma.$executeRawUnsafe(NativeQuery.disconnectOrderDataFromCustomer(ids));

    return this.prisma.customer.updateMany({
      where: {
        id: { in: ids },
      },
      data: { isDeleted: true },
    });
  }
}