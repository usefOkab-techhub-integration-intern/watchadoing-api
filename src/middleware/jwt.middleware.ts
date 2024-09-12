import {Provider, inject} from '@loopback/core';
import {Middleware, MiddlewareContext} from '@loopback/rest';
import {Request, Response} from 'express';
import * as jwt from 'jsonwebtoken';
require('dotenv').config();


export class JwtMiddlewareProvider implements Provider<Middleware> {
  constructor(
    @inject('authentication.jwt.secret') private jwtSecret: string | undefined = process.env.JWT_SECRET, 
  ) {}

  value(): Middleware {
    return async (middlewareCtx: MiddlewareContext, next) => {
      const {request, response} = middlewareCtx;
      const req = request as Request;
      const res = response as Response;

      if (req.path === '/admin/login') {
        return next(); 
      }

      const token = req.headers['authorization'];      
      if (!token) {
        res.status(401).json({message: 'No token provided'});
        return;
      }

      try {
        const decoded = jwt.verify(token, this.jwtSecret || "defaultsecret");
        (req as any).user = decoded;
      } catch (err) {
        res.status(403).json({message: 'Invalid token'});
        return;
      }

      return next();
    };
  }
}