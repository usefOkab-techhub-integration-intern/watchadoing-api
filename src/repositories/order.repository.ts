import { PrismaClient } from '@prisma/client';
import { NativeQuery } from './native.repository';
import { UnifiedDTO } from '../dto/unified.dto';
import { PageSortParams } from '../models/paging.sorting.model';
import { WatchOrderCreation, WatchOrderFilter } from '../models';
import { NotFoundError, InternalServerError } from '../utils/errors'; // Import custom errors

export class OrderRepository {
  private prisma = new PrismaClient();
  private dto = new UnifiedDTO();

  async findFiltered(
    pageSortParams: PageSortParams,
    filter?: WatchOrderFilter
  ) {
    try {
      const { page, pageSize, sortBy, sortOrder } = pageSortParams;
      const orders = await this.prisma.watchOrder.findMany({
        where: filter?.build(),
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
    } catch (error) {
      console.error(`Failed to fetch filtered orders: ${error.message}`);
      throw new InternalServerError(`Failed to fetch filtered orders: ${error.message}`);
    }
  }

  async findById(id: number) {
    try {
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

      if (!order) {
        throw new NotFoundError('Order not found');
      }

      return this.dto.mapWatchOrder(order);
    } catch (error) {
      console.error(`Failed to fetch order by ID: ${error.message}`);
      throw new InternalServerError(`Failed to fetch order by ID: ${error.message}`);
    }
  }

  async bulkCreate(dataArray: WatchOrderCreation[]) {
    try {
      const results = [];
  
      for (const data of dataArray) {
        // Check if the customer exists
        const customer = await this.prisma.customer.findUnique({
          where: { id: data.customerId },
        });
  
        if (!customer) {
          throw new NotFoundError(`Customer with ID ${data.customerId} not found`);
        }
  
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
    } catch (error) {
      console.error(`Failed to bulk create orders: ${error.message}`);
      throw new InternalServerError(`Failed to bulk create orders: ${error.message}`);
    }
  }

  async bulkDelete(ids: number[]) {
    try {
      await this.prisma.$executeRawUnsafe(NativeQuery.deleteOrderData(ids));
    } catch (error) {
      console.error(`Failed to bulk delete orders: ${error.message}`);
      throw new InternalServerError(`Failed to bulk delete orders: ${error.message}`);
    }
  }
}