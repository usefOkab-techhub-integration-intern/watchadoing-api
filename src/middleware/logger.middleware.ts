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
    new winston.transports.File({ filename: 'success.log', level: 'info' }), 
  ],
});

export function loggerMiddleware(): Middleware {
  return async (middlewareCtx: MiddlewareContext, next) => {
    const { request, response } = middlewareCtx;
    const req = request as Request;
    const res = response as Response;

    const start = Date.now();

    try {
      const result = await next();
      const duration = Date.now() - start;

      logger.info({
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration: `${duration}ms`,
        username: (req as any).user?.username, 
        params: req.params,
        body: req.body,
      });

      return result;
    } catch (err) {
      logger.error({
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        message: err.message,
        username: (req as any).user?.username, 
        params: req.params,
        body: req.body,
      });

      throw err; 
    }
  };
}