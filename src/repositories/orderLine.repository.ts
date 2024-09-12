import { PrismaClient } from '@prisma/client';
import { UnifiedDTO } from '../dto/unified.dto';
import { PageSortParams } from '../models/paging.sorting.model';
import { WatchOrderLineCreation, WatchOrderLineFilter, WatchOrderLineUpdate } from '../models';
import { NotFoundError, InternalServerError, BadRequestError } from '../utils/errors'; // Import custom errors

export class WatchOrderLineRepository {
  private prisma = new PrismaClient();
  private dto = new UnifiedDTO();

  async findById(id: number) {
    try {
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

      if (!watchOrderLine) {
        throw new NotFoundError(`WatchOrderLine with ID ${id} not found.`);
      }

      return this.dto.mapWatchOrderLine(watchOrderLine);
    } catch (error) {
      console.error(`Failed to find WatchOrderLine by ID: ${error.message}`);
      throw new InternalServerError(`Failed to find WatchOrderLine by ID: ${error.message}`);
    }
  }

  async findFiltered(
    pageSortParams: PageSortParams,
    filter?: WatchOrderLineFilter
  ) {
    try {
      const { page, pageSize, sortBy, sortOrder } = pageSortParams;
      const watchOrderLines = await this.prisma.watchOrderLine.findMany({
        where: filter?.build(),
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
    } catch (error) {
      console.error(`Failed to find filtered WatchOrderLines: ${error.message}`);
      throw new InternalServerError(`Failed to find filtered WatchOrderLines: ${error.message}`);
    }
  }

  async bulkCreate(orderLines: WatchOrderLineCreation[]) {
    try {
      const results = [];

      for (const line of orderLines) {
        const watch = await this.prisma.watch.findUnique({
          where: { id: line.watchId },
        });

        if (!watch) {
          throw new NotFoundError(`Watch with ID ${line.watchId} not found.`);
        }
        if (watch.quantity < line.quantity) {
          throw new InternalServerError(`Insufficient stock for Watch ID ${line.watchId}.`);
        }

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
    } catch (error) {
      console.error(`Failed to bulk create WatchOrderLines: ${error.message}`);
      throw new InternalServerError(`Failed to bulk create WatchOrderLines: ${error.message}`);
    }
  }

  async bulkUpdate(orderLines: WatchOrderLineUpdate[]) {
    try {
      const results = [];

      for (const line of orderLines) {
        const orderLine = await this.prisma.watchOrderLine.findUnique({
          where: { id: line.id },
          include: { watch: true },
        });

        if (!orderLine) {
          throw new NotFoundError(`WatchOrderLine with ID ${line.id} not found.`);
        }

        const watch = await this.prisma.watch.findUnique({
          where: { id: orderLine.watchId },
        });

        if (!watch) {
          throw new NotFoundError(`Watch with ID ${orderLine.watchId} not found.`);
        }
        if (watch.quantity + orderLine.quantity < line.quantity) {
          throw new BadRequestError(`Insufficient stock to update WatchOrderLine with ID ${line.id}.`);
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
    } catch (error) {
      console.error(`Failed to bulk update WatchOrderLines: ${error.message}`);
      throw new InternalServerError(`Failed to bulk update WatchOrderLines: ${error.message}`);
    }
  }

  async bulkDelete(ids: number[]) {
    try {
      await this.prisma.watchOrderLine.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      });
    } catch (error) {
      console.error(`Failed to bulk delete WatchOrderLines: ${error.message}`);
      throw new InternalServerError(`Failed to bulk delete WatchOrderLines: ${error.message}`);
    }
  }
}