import { Category } from "@prisma/client";
import { CategoryDTO, CategoryI } from "./category.dto";

export interface WatchI{
  id         : number,
  model      : string,
  origin     : string,
  sn         : string,
  price      : number,
  quantity   : number,
  createdAt  : Date,
  updatedAt  : Date,
  categories : CategoryI[],
}

export class WatchDTO {

    constructor(private categoryDTO : CategoryDTO) {}

    mapArray(watches: any[]): WatchI[] {
      return watches.map(watch => this.map(watch));
    }

    map(watch: any): WatchI {
      return {
        id: watch.id,
        model: watch.model,
        origin: watch.origin,
        sn: watch.sn,
        price: watch.price,
        quantity: watch.quantity,
        createdAt: watch.createdAt,
        updatedAt: watch.updatedAt,
        categories: this.categoryDTO.mapArray(watch.categories),
      };
    }
  }