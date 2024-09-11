export interface CategoryI {
    id: number;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface WatchI {
    id: number;
    model: string;
    origin: string;
    sn: string;
    price: number;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
    categories: CategoryI[];
  }
  
  export interface WatchOrderLineI {
    id: number;
    quantity: number;
    watch: WatchI;
    order: WatchOrderNoOrderLinesI;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface WatchOrderLineNoOrderI {
    id: number;
    quantity: number;
    watch: WatchI;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface WatchOrderI {
    id: number;
    customer: CustomerNoOrderI;
    shipment: OrderShipmentNoOrderI | null;
    orderLines: WatchOrderLineNoOrderI[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface WatchOrderNoCustomerI {
    id: number;
    shipment: OrderShipmentNoOrderI;
    orderLines: WatchOrderLineNoOrderI[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface WatchOrderNoShipmentI {
    id: number;
    customer: CustomerNoOrderI;
    orderLines: WatchOrderLineNoOrderI[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface WatchOrderNoOrderLinesI {
    id: number;
    customer: CustomerNoOrderI;
    shipment: OrderShipmentNoOrderI;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface OrderShipmentI {
    id: number;
    trackingNum: string;
    isDone: Boolean;
    createdAt: Date;
    updatedAt: Date;
    order: WatchOrderNoShipmentI;
  }
  
  export interface OrderShipmentNoOrderI {
    id: number;
    trackingNum: string;
    isDone: Boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface CustomerI {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    orders: WatchOrderNoCustomerI[];
  }
  
  export interface CustomerNoOrderI {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }