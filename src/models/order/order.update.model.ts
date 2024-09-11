import { model, property } from '@loopback/repository';

@model()
export class WatchOrderUpdate {

  constructor(data?: Partial<WatchOrderUpdate>) {
    Object.assign(this, data);
  }
}