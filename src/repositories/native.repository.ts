export class NativeQuery {
  static disconnectWatchesFromCategories(categoryIds: number[]): string {
    return `
      DELETE FROM _CategoryToWatch
      WHERE A IN (${categoryIds.join(',')});
    `;
  }

  static disconnectCategoriesFromWatch(watchId: number): string {
    return `
      DELETE FROM _CategoryToWatch
      WHERE B = ${watchId});
    `;
  }

  static disconnectOrderDataFromCustomer(customerIds: number[]): string {
    const customerIdsList = customerIds.join(',');

    return `
      DELETE FROM OrderShipment
      WHERE id IN (
        SELECT shipmentId FROM WatchOrder WHERE customerId IN (${customerIdsList})
      );

      DELETE FROM WatchOrderLine
      WHERE orderId IN (
        SELECT id FROM WatchOrder WHERE customerId IN (${customerIdsList})
      );

      DELETE FROM WatchOrder
      WHERE customerId IN (${customerIdsList});
    `;
  }

  static disconnectShipmentsFromOrder(orderIds: number[]): string {
    const orderIdsList = orderIds.join(',');

    return `
      DELETE FROM OrderShipment
      WHERE id IN (
        SELECT shipmentId FROM WatchOrder WHERE id IN (${orderIdsList})
      );`
  }
}