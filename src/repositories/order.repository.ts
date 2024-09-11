import { PrismaClient } from '@prisma/client';
import { NativeQuery } from './native.repository';
import { UnifiedDTO } from '../dto/unified.dto';

export class OrderRepository {
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

    if (filter) {
      if (filter.orderId) {
        whereClause.order.id = filter.orderId;
      } else if (filter.name) {
        whereClause.order.name = { contains: filter.orderName };
      }
    }

    const orders = await this.prisma.watchOrder.findMany({
      where: whereClause,
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
        },
        customer: true
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    return this.dto.mapWatchOrderArray(orders);
  }

  async findById(id: number) {
    return this.prisma.watchOrder.findUnique({
      where: { id },
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
        },
        customer: true
      },
    });
  }

  async bulkCreate(dataArray: any[]) {
    const results = [];
    for (const data of dataArray) {
      const result = await this.prisma.watchOrder.create({
        data: data,
      });
      results.push(result);
    }
    return results;
  }

  async bulkUpdate(dataArray: any[]) {
    const results = [];
    for (const data of dataArray) {
      const result = await this.prisma.watchOrder.update({
        where: { id: data.id },
        data: data,
      });
      results.push(result);
    }
    return results;
  }

  async bulkDelete(ids: number[]) {
    await this.prisma.$executeRawUnsafe(NativeQuery.disconnectShipmentsFromOrder(ids));
    return this.prisma.watchOrder.deleteMany({
      where: {
        id: { in: ids },
      },
    });
  }
}