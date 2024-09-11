import { PrismaClient } from '@prisma/client';
import { UnifiedDTO } from '../dto/unified.dto';

export class WatchOrderLineRepository {
  private prisma = new PrismaClient();
  private dto = new UnifiedDTO();

  async findById(id: number) {
    const watchOrderLine = await this.prisma.watchOrderLine.findUnique({
      where: { id },
      include: {
        watch: {
          include: {
            categories: true
          }
        },
        order: {
          include: {
            customer: true,
            shipment: true
          }
        },
      },
    });
    return this.dto.mapWatchOrderLine(watchOrderLine);
  }

  // Filter WatchOrderLine entries by various parameters
  async findFiltered(
    page: number = 1,
    pageSize: number = 10,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
    filter: any
  ) {
    const whereClause: any = {};

    if (filter) {
      if (filter.orderId) {
        whereClause.orderId = filter.orderId;
      }
      if (filter.watchId) {
        whereClause.watchId = filter.watchId;
      }
      if (filter.quantity) {
        whereClause.quantity = filter.quantity;
      }
      if (filter.watchModel) {
        whereClause.watch = { model: { contains: filter.watchModel } };
      }
      if (filter.watchOrigin) {
        whereClause.watch = { origin: { contains: filter.watchOrigin } };
      }
      if (filter.watchSN) {
        whereClause.watch = { serialNumber: { contains: filter.watchSN } };
      }
      if (filter.watchCategoryName) {
        whereClause.watch = {
          categories: { some: { name: { contains: filter.watchCategoryName } } },
        };
      }
    }

    const watchOrderLines = await this.prisma.watchOrderLine.findMany({
      where: whereClause,
      include: {
        watch: {
          include: {
            categories: true
          }
        },
        order: {
          include: {
            customer: true,
            shipment: true
          }
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    return this.dto.mapWatchOrderLineArray(watchOrderLines);
  }

  async bulkCreate(orderLines: any[]) {
    const results = [];

    for (const line of orderLines) {
      const watch = await this.prisma.watch.findUnique({
        where: { id: line.watchId },
      });

      if (!watch) throw new Error(`Watch with ID ${line.watchId} not found.`);
      if (watch.quantity < line.quantity) throw new Error(`Insufficient stock for Watch ID ${line.watchId}.`);

      const orderLine = await this.prisma.watchOrderLine.create({
        data: {
          watch: { connect: { id: line.watchId } },
          order: { connect: { id: line.orderId } },
          quantity: line.quantity,
        },
      });

      await this.prisma.watch.update({
        where: { id: line.watchId },
        data: { quantity: watch.quantity - line.quantity },
      });

      results.push(orderLine);
    }

    return results;
  }

  async bulkUpdate(orderLines: { id: number; quantity: number }[]) {
    const results = [];

    for (const line of orderLines) {
      const orderLine = await this.prisma.watchOrderLine.findUnique({
        where: { id: line.id },
        include: { watch: true },
      });

      if (!orderLine) throw new Error(`OrderLine with ID ${line.id} not found.`);
      const watch = await this.prisma.watch.findUnique({
        where: { id: orderLine.watchId },
      });

      if (!watch) throw new Error(`Watch with ID ${orderLine.watchId} not found.`);
      if (watch.quantity + orderLine.quantity < line.quantity) {
        throw new Error(`Insufficient stock to update OrderLine with ID ${line.id}.`);
      }

      const updatedOrderLine = await this.prisma.watchOrderLine.update({
        where: { id: line.id },
        data: {
          quantity: line.quantity,
        },
      });

      await this.prisma.watch.update({
        where: { id: orderLine.watchId },
        data: { quantity: watch.quantity + orderLine.quantity - line.quantity },
      });

      results.push(updatedOrderLine);
    }

    return results;
  }

  async bulkDelete(ids: number[]) {
    await this.prisma.watchOrderLine.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}