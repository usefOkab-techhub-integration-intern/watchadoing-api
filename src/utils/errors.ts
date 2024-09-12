import { HttpErrors } from '@loopback/rest';

export class BadRequestError extends HttpErrors.BadRequest {
  constructor(message: string) {
    super(message);
    this.status = 400;
  }
}

export class NotFoundError extends HttpErrors.NotFound {
  constructor(message: string) {
    super(message);
    this.status = 404;
  }
}

export class InternalServerError extends HttpErrors.InternalServerError {
  constructor(message: string) {
    super(message);
    this.status = 500;
  }
}