import { PrismaClient } from '@prisma/client';
import { UnifiedDTO } from '../dto/unified.dto';
import { PageSortParams } from '../models/paging.sorting.model';
import { OrderShipmentCreation, OrderShipmentFilter, OrderShipmentUpdate } from '../models';
import { NotFoundError, InternalServerError, BadRequestError } from '../utils/errors'; // Import custom errors

export class OrderShipmentRepository {
  private prisma = new PrismaClient();
  private dto = new UnifiedDTO();

  async findById(id: number) {
    try {
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

      if (!shipment) {
        throw new NotFoundError(`OrderShipment with ID ${id} not found.`);
      }

      return this.dto.mapOrderShipment(shipment);
    } catch (error) {
      console.error(`Failed to find OrderShipment by ID: ${error.message}`);
      throw new InternalServerError(`Failed to find OrderShipment by ID: ${error.message}`);
    }
  }

  async findFiltered(
    pageSortParams: PageSortParams,
    filter?: OrderShipmentFilter
  ) {
    try {
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
    } catch (error) {
      console.error(`Failed to find filtered OrderShipments: ${error.message}`);
      throw new InternalServerError(`Failed to find filtered OrderShipments: ${error.message}`);
    }
  }

  async bulkCreate(shipments: OrderShipmentCreation[]) {
    try {
      const results = [];

      for (const shipment of shipments) {
        const order = await this.prisma.watchOrder.findUnique({
          where: { id: shipment.orderId },
          include: {
            orderLines: true,
          },
        });

        if (!order) {
          throw new NotFoundError(`Order with ID ${shipment.orderId} not found.`);
        }
        if (order.orderLines.length === 0) {
          throw new BadRequestError(`Order with ID ${shipment.orderId} has no order lines.`);
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
    } catch (error) {
      console.error(`Failed to bulk create OrderShipments: ${error.message}`);
      throw new InternalServerError(`Failed to bulk create OrderShipments: ${error.message}`);
    }
  }

  async bulkUpdate(shipments: OrderShipmentUpdate[]) {
    try {
      const results = [];

      for (const shipment of shipments) {
        const result = await this.prisma.orderShipment.update({
          where: { id: shipment.id },
          data: shipment,
        });

        results.push(result);
      }

      return results;
    } catch (error) {
      console.error(`Failed to bulk update OrderShipments: ${error.message}`);
      throw new InternalServerError(`Failed to bulk update OrderShipments: ${error.message}`);
    }
  }

  async bulkDelete(ids: number[]) {
    try {
      await this.prisma.orderShipment.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      });
    } catch (error) {
      console.error(`Failed to bulk delete OrderShipments: ${error.message}`);
      throw new InternalServerError(`Failed to bulk delete OrderShipments: ${error.message}`);
    }
  }
}