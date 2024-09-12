import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';
import {JwtMiddlewareProvider} from './middleware/jwt.middleware';
import {SecuritySchemeObject} from '@loopback/openapi-v3';
require('dotenv').config();


export {ApplicationConfig};

export class WatchaDoingApi extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    this.sequence(MySequence);

    this.static('/', path.join(__dirname, '../public'));

    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    this.bootOptions = {
      controllers: {
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    this.bind('authentication.jwt.secret').to(process.env.JWT_SECRET || 'defaultSecret');

    this.middleware(JwtMiddlewareProvider);

    this.addSecuritySpec();
  }

  addSecuritySpec() {
    const securitySchemeSpec: SecuritySchemeObject = {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    };

    this.api({
      openapi: '3.0.0',
      info: {title: 'WatchaDoing API', version: '1.0.0'},
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