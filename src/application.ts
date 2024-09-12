import { BootMixin } from '@loopback/boot';
import { ApplicationConfig } from '@loopback/core';
import { RestExplorerBindings, RestExplorerComponent } from '@loopback/rest-explorer';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { ServiceMixin } from '@loopback/service-proxy';
import path from 'path';
import { MySequence } from './sequence';
import { SecuritySchemeObject } from '@loopback/openapi-v3';
import { JwtMiddlewareProvider } from './middleware/jwt.middleware';
import { loggerMiddleware } from './middleware/logger.middleware';
import { createRateLimiter } from './middleware/rateLimiter.middleware';


require('dotenv').config();

export { ApplicationConfig };

export class WatchaDoingApi extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    this.sequence(MySequence);

    this.static('/', path.join(__dirname, '../public'));

    this.addSecuritySpec();

    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.bind('authentication.jwt.secret').to(process.env.JWT_SECRET || 'defaultSecret');

    this.middleware(JwtMiddlewareProvider);

    const rateLimiter = createRateLimiter({
      windowMs: Number(process.env.RL_TIME_UNIT),
      max: Number(process.env.RL_MAX),
      message: "Too many requests from this IP. Please try again later.",
    });

    this.middleware(rateLimiter);

    this.middleware(loggerMiddleware());

    this.projectRoot = __dirname;
    this.bootOptions = {
      controllers: {
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  addSecuritySpec() {
    const securitySchemeSpec: SecuritySchemeObject = {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    };

    this.api({
      openapi: '3.0.0',
      info: { title: 'WatchaDoing API', version: '1.0.0' },
      paths: {},
      components: {
        securitySchemes: {
          BearerAuth: securitySchemeSpec,
        },
      },
      security: [
        {
          BearerAuth: [],
        },
      ],
    });
  }
}