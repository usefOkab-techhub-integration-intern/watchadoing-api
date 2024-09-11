import  * as DTO from "./interfaces.dto";


export class UnifiedDTO {
  constructor() {}

  // CategoryDTO Methods
  mapCategoryArray(categories: any[]): DTO.CategoryI[] {
    return categories.map(category => this.mapCategory(category));
  }

  mapCategory(category: any): DTO.CategoryI {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  // WatchDTO Methods
  mapWatchArray(watches: any[]): DTO.WatchI[] {
    return watches.map(watch => this.mapWatch(watch));
  }

  mapWatch(watch: any): DTO.WatchI {
    return {
      id: watch.id,
      model: watch.model,
      origin: watch.origin,
      sn: watch.sn,
      price: watch.price,
      quantity: watch.quantity,
      createdAt: watch.createdAt,
      updatedAt: watch.updatedAt,
      categories: this.mapCategoryArray(watch.categories),
    };
  }

  // WatchOrderDTO Methods
  mapWatchOrderArray(orders: any[]): DTO.WatchOrderI[] {
    return orders.map(order => this.mapWatchOrder(order));
  }

  mapWatchOrder(order: any): DTO.WatchOrderI {
    return {
      id: order.id,
      customer: this.mapCustomerNoOrder(order.customer),
      shipment: this.mapOrderShipmentNoOrder(order.shipment),
      orderLines: this.mapWatchOrderLineArrayNoOrder(order.orderLines),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  mapWatchOrderArrayNoCustomer(orders: any[]): DTO.WatchOrderNoCustomerI[] {
    return orders.map(order => this.mapWatchOrderNoCustomer(order));
  }

  mapWatchOrderNoCustomer(order: any): DTO.WatchOrderNoCustomerI {
    return {
      id: order.id,
      shipment: this.mapOrderShipmentNoOrder(order.shipment),
      orderLines: this.mapWatchOrderLineArrayNoOrder(order.orderLines),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  mapWatchOrderNoShipment(order: any): DTO.WatchOrderNoShipmentI {
    return {
      id: order.id,
      customer: this.mapCustomerNoOrder(order.customer),
      orderLines: this.mapWatchOrderLineArrayNoOrder(order.orderLines),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  mapWatchOrderNoOrderLines(order: any): DTO.WatchOrderNoOrderLinesI {
    return {
      id: order.id,
      customer: this.mapCustomerNoOrder(order.customer),
      shipment: this.mapOrderShipmentNoOrder(order.shipment),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  // WatchOrderLineDTO Methods
  mapWatchOrderLineArray(orderLines: any[]): DTO.WatchOrderLineI[] {
    return orderLines.map(orderLine => this.mapWatchOrderLine(orderLine));
  }

  mapWatchOrderLine(orderLine: any): DTO.WatchOrderLineI {
    return {
      id: orderLine.id,
      quantity: orderLine.quantity,
      createdAt: orderLine.createdAt,
      updatedAt: orderLine.updatedAt,
      order: this.mapWatchOrderNoOrderLines(orderLine.order),
      watch: this.mapWatch(orderLine.watch),
    };
  }

  mapWatchOrderLineArrayNoOrder(orderLines: any[]): DTO.WatchOrderLineNoOrderI[] {
    return orderLines.map(orderLine => this.mapWatchOrderLineNoOrder(orderLine));
  }

  mapWatchOrderLineNoOrder(orderLine: any): DTO.WatchOrderLineNoOrderI {
    return {
      id: orderLine.id,
      quantity: orderLine.quantity,
      createdAt: orderLine.createdAt,
      updatedAt: orderLine.updatedAt,
      watch: this.mapWatch(orderLine.watch),
    };
  }

  // OrderShipmentDTO Methods
  mapOrderShipmentArray(shipments: any[]): DTO.OrderShipmentI[] {
    return shipments.map(shipment => this.mapOrderShipment(shipment));
  }

  mapOrderShipment(shipment: any): DTO.OrderShipmentI {
    return {
      id: shipment.id,
      trackingNum: shipment.trackingNum,
      addedAt: shipment.createdAt,
      updatedAt: shipment.updatedAt,
      order: this.mapWatchOrderNoShipment(shipment.order),
    };
  }

  mapOrderShipmentNoOrder(shipment: any): DTO.OrderShipmentNoOrderI {
    return {
      id: shipment.id,
      trackingNum: shipment.trackingNum,
      addedAt: shipment.createdAt,
      updatedAt: shipment.updatedAt,
    };
  }

  // CustomerDTO Methods
  mapCustomerArray(customers: any[]): DTO.CustomerI[] {
    return customers.map(customer => this.mapCustomer(customer));
  }

  mapCustomer(customer: any): DTO.CustomerI {
    return {
      id: customer.id,
      name: customer.name,
      addedAt: customer.createdAt,
      updatedAt: customer.updatedAt,
      orders: this.mapWatchOrderArrayNoCustomer(customer.orders),
    };
  }

  mapCustomerNoOrder(customer: any): DTO.CustomerNoOrderI {
    return {
      id: customer.id,
      name: customer.name,
      addedAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    };
  }
}