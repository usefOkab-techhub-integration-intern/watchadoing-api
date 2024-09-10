import { WatchOrderDTO, WatchOrderI } from "./order.dto";

export interface CustomerI{
    id        : number,         
    name      : string,      
    addedAt   : string,    
    updatedAt : string,    
    orders    : WatchOrderI[]
  }

export interface CustomerNoOrderI{
    id        : number,         
    name      : string,      
    addedAt   : string,    
    updatedAt : string
}
  
export class CustomerDTO {
  
    constructor(private orderDTO : WatchOrderDTO) {}
  
    mapArray(customers: any[]): CustomerI[] {
        return customers.map(customer => this.map(customer));
    }
  
    map(customer: any): CustomerI {
        return {
            id: customer.id,
            name: customer.name,
            addedAt: customer.createdAt,
            updatedAt: customer.updatedAt,
            orders: this.orderDTO.mapArray(customer.orders)
        };  
    }

    mapNoOrder(customer: any): CustomerNoOrderI {
        return {
            id: customer.id,
            name: customer.name,
            addedAt: customer.createdAt,
            updatedAt: customer.updatedAt
        };  
    }
}