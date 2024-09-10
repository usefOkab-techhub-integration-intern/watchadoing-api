import { WatchOrderDTO, WatchOrderNoOrderLinesI } from "./order.dto";
import { WatchDTO, WatchI } from "./watch.dto";

export interface WatchOrderLineI {
    id            : number,
    quantity      : number,
    watch         : WatchI,
    order         : WatchOrderNoOrderLinesI,
    createdAt     : Date,
    updatedAt     : Date,
}

export interface WatchOrderLineNoOrderI {
    id            : number,
    quantity      : number,
    watch         : WatchI,
    createdAt     : Date,
    updatedAt     : Date,
}


export class WatchOrderLineDTO {
    
    private watchDTO : WatchDTO
    private orderDTO : WatchOrderDTO

    constructor(
        
    ) {}

    mapArray(orderLines: any[]): WatchOrderLineI[] {
      return orderLines.map(orderLine => this.map(orderLine));
    }

    map(orderLine: any): WatchOrderLineI {
      return {
        id: orderLine.id,
        quantity: orderLine.quantity,
        createdAt: orderLine.createdAt,
        updatedAt: orderLine.updatedAt,
        order: this.orderDTO.mapNoOrderLines(orderLine.order),
        watch: this.watchDTO.map(orderLine.watch)
      };
    }

    mapArrayNoOrder(orderLines: any[]): WatchOrderLineNoOrderI[] {
        return orderLines.map(orderLine => this.mapNoOrder(orderLine));
      }

    mapNoOrder(orderLine: any): WatchOrderLineNoOrderI {
        return {
          id: orderLine.id,
          quantity: orderLine.quantity,
          createdAt: orderLine.createdAt,
          updatedAt: orderLine.updatedAt,
          watch: this.watchDTO.map(orderLine.watch)
        };
      }

}