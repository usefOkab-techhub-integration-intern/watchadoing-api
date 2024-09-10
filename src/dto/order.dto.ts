import { CustomerDTO, CustomerNoOrderI } from "./customer.dto";
import { WatchOrderLineDTO, WatchOrderLineNoOrderI } from "./orderLine.dto";
import { OrderShipmentDTO, OrderShipmentNoOrderI } from "./shipment.dto";

export interface WatchOrderI{
    id            : number,
    customer      : CustomerNoOrderI,
    shipment      : OrderShipmentNoOrderI,
    orderLines    : WatchOrderLineNoOrderI[],
    createdAt     : Date,
    updatedAt     : Date
}

export interface WatchOrderNoCustomerI{
    id            : number,
    shipment      : OrderShipmentNoOrderI,
    orderLines    : WatchOrderLineNoOrderI[],
    createdAt     : Date,
    updatedAt     : Date
}

export interface WatchOrderNoShipmentI{
    id            : number,
    customer      : CustomerNoOrderI,
    orderLines    : WatchOrderLineNoOrderI[],
    createdAt     : Date,
    updatedAt     : Date
}

export interface WatchOrderNoOrderLinesI{
    id            : number,
    customer      : CustomerNoOrderI,
    shipment      : OrderShipmentNoOrderI,
    createdAt     : Date,
    updatedAt     : Date
}

export class WatchOrderDTO {
  
    constructor(
        private customerDTO : CustomerDTO,
        private shipmentDTO : OrderShipmentDTO,
        private orderLineDTO : WatchOrderLineDTO
    ) {}
  
    mapArray(orders: any[]): WatchOrderI[] {
        return orders.map(order => this.map(order));
    }
  
    map(order: any): WatchOrderI {
        return {
            id         : order.id,
            customer   : this.customerDTO.mapNoOrder(order.customer),
            shipment   : this.shipmentDTO.mapNoOrder(order.shipment),
            orderLines : this.orderLineDTO.mapArrayNoOrder(order.orderLines),
            createdAt  : order.createdAt,   
            updatedAt  : order.updatedAt    
        };  
    }

    mapNoCustomer(order: any): WatchOrderNoCustomerI {
        return {
            id         : order.id,
            shipment   : this.shipmentDTO.mapNoOrder(order.shipment),
            orderLines : this.orderLineDTO.mapArrayNoOrder(order.orderLines),
            createdAt  : order.createdAt,
            updatedAt  : order.updatedAt
        };  
    }

    mapNoShipment(order: any) : WatchOrderNoShipmentI {
        return {
            id         : order.id,
            customer   : this.customerDTO.mapNoOrder(order.customer),
            orderLines : this.orderLineDTO.mapArrayNoOrder(order.orderLines),
            createdAt  : order.createdAt,
            updatedAt  : order.updatedAt
        };  
    }

    mapNoOrderLines(order: any) : WatchOrderNoOrderLinesI {
        return {
            id         : order.id,
            customer   : this.customerDTO.mapNoOrder(order.customer),
            shipment   : this.shipmentDTO.mapNoOrder(order.shipment),
            createdAt  : order.createdAt,
            updatedAt  : order.updatedAt
        };  
    }
}