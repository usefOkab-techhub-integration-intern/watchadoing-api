import { PrismaClient } from '@prisma/client';
import { UnifiedDTO } from '../dto/unified.dto';
import { PageSortParams } from '../models/paging.sorting.model';
import { OrderShipmentCreation, OrderShipmentFilter, OrderShipmentUpdate } from '../models';

export class OrderShipmentRepository {
  private prisma = new PrismaClient();
  private dto = new UnifiedDTO();

  async findById(id: number) {
    const shipment = await this.prisma.orderShipment.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            customer: true,
            orderLines: {
              include: {
                watch: {
                  include: {
                    categories: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return this.dto.mapOrderShipment(shipment);
  }

  async findFiltered(
    pageSortParams: PageSortParams,
    filter?: OrderShipmentFilter
  ) {
    const { page, pageSize, sortBy, sortOrder } = pageSortParams;

    const orderShipments = await this.prisma.orderShipment.findMany({
      where: filter?.build(),
      include: {
        order: {
          include: {
            customer: true,
            orderLines: {
              include: {
                watch: {
                  include: {
                    categories: true,
                  },
                },
              },
            },
          },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    return this.dto.mapOrderShipmentArray(orderShipments);
  }

  async bulkCreate(shipments: any[]) {
    const results = [];
    for (const shipment of shipments) {
      const order = await this.prisma.watchOrder.findUnique({
        where: { id: shipment.orderId },
        include: {
          orderLines: true, 
        },
      });
      if (!order) {
        throw new Error(`Order with ID ${shipment.orderId} not found.`);
      }
      if (order.orderLines.length === 0) {
        throw new Error(`Order with ID ${shipment.orderId} has no order lines.`);
      }
      const result = await this.prisma.orderShipment.create({
        data: {
          ...shipment, 
          order: {
            connect: { id: shipment.orderId }, 
          },
        },
      });
  
      results.push(result);
    }
  
    return results;
  }

  async bulkUpdate(shipments: OrderShipmentUpdate[]) {
    const results = [];

    for (const shipment of shipments) {
      const result = await this.prisma.orderShipment.update({
        where: { id: shipment.id },
        data: shipment,
      });
      results.push(result);
    }

    return results;
  }

  async bulkDelete(ids: number[]) {
    await this.prisma.orderShipment.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}