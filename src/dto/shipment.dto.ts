import { WatchOrderDTO, WatchOrderNoShipmentI } from "./order.dto";

export interface OrderShipmentI{
    id          : number,         
    trackingNum : number,      
    addedAt     : Date,    
    updatedAt   : Date 
    order       : WatchOrderNoShipmentI
}

export interface OrderShipmentNoOrderI{
    id          : number,         
    trackingNum : number,      
    addedAt     : Date,    
    updatedAt   : Date 
}

export class OrderShipmentDTO {
  
    constructor(private orderDTO : WatchOrderDTO) {}
  
    mapArray(shipments: any[]): OrderShipmentI[] {
        return shipments.map(shipment => this.map(shipment));
    }
  
    map(shipment: any): OrderShipmentI {
        return {
            id: shipment.id,
            trackingNum: shipment.trackingNum,
            addedAt: shipment.createdAt,
            updatedAt: shipment.updatedAt,
            order: this.orderDTO.mapNoShipment(shipment.orders)
        };  
    }

    mapNoOrder(shipment: any): OrderShipmentNoOrderI {
        return {
            id: shipment.id,
            trackingNum: shipment.trackingNum,
            addedAt: shipment.createdAt,
            updatedAt: shipment.updatedAt
        };  
    }
}