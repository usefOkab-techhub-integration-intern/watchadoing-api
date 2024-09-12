import { Middleware, MiddlewareContext } from '@loopback/rest';
import { Request, Response } from 'express';
import * as winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
  ],
});

export function errorHandlerMiddleware(): Middleware {
  return async (middlewareCtx: MiddlewareContext, next) => {
    const { request, response } = middlewareCtx;
    const req = request as Request;
    const res = response as Response;

    try {
      const response = await next();
      return response;
    } catch (err) {
      logger.error({
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        message: err.message,
        stack: err.stack,
      });

      res.status(err.statusCode || 500).json({
        message: err.message || 'Internal Server Error',
        status: err.statusCode || 500,
      });
    }
  };
}