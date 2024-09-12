import rateLimit, { Options as RateLimitOptions } from 'express-rate-limit';
import { Middleware } from '@loopback/rest';
import { Request, Response } from 'express';

export function createRateLimiter(options: any): Middleware {
  const limiter = rateLimit(options);

  return async (context: any, next) => {
    const req = context.request as Request;
    const res = context.response as Response;

    limiter(req, res, (err: any) => {
      if (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
        return;
      }
    });
    return next();
  };
}