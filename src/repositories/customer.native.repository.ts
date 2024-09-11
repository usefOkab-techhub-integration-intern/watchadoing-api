import { PrismaClient } from '@prisma/client';

export class CustomerNativeRepository {
  private prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async deleteAllOrderData(customerIds: number[]): Promise<void> {
    const query = CustomerQuery.deleteOrderData(customerIds);
    await this.prisma.$executeRawUnsafe(query);
  }
}

class CustomerQuery {
  static deleteOrderData(customerIds: number[]): string {
    const customerIdsList = customerIds.join(',');

    return `
      DELETE FROM WatchOrderLine
      WHERE orderId IN (
        SELECT id FROM WatchOrder WHERE customerId IN (${customerIdsList})
      );

      DELETE FROM OrderShipment
      WHERE id IN (
        SELECT shipmentId FROM WatchOrder WHERE customerId IN (${customerIdsList})
      );

      DELETE FROM WatchOrder
      WHERE customerId IN (${customerIdsList});
    `;
  }
}