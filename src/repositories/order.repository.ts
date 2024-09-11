import { PrismaClient } from '@prisma/client';
import { NativeQuery } from './native.repository';
import { UnifiedDTO } from '../dto/unified.dto';
import { PageSortParams } from '../models/paging.sorting.model';
import { WatchOrderFilter } from '../models';

export class OrderRepository {
  private prisma = new PrismaClient();
  private dto = new UnifiedDTO();

  async findFiltered(
    pageSortParams : PageSortParams,
    filter? : WatchOrderFilter
  ) {
    const {page, pageSize, sortBy, sortOrder} = pageSortParams
    const whereClause: any = {
      ...(filter?.customerId && { customerId: filter.customerId }),
      ...(filter?.customerName && {
        customer: {
          name: {
            contains: filter.customerName,
          },
        },
      }),
    };
  
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
    const order = await this.prisma.watchOrder.findUnique({
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
    return this.dto.mapWatchOrder(order);
  }

  async bulkCreate(dataArray: any[]) {
    const results = [];
  
    for (const data of dataArray) {
      const result = await this.prisma.watchOrder.create({
        data: {
          customer: {
            connect: {
              id: data.customerId, 
            },
          },
        },
      });
      results.push(result);
    }
  
    return results;
  }

  async bulkDelete(ids: number[]) {
    await this.prisma.$executeRawUnsafe(NativeQuery.deleteOrderData(ids));
  }
}