import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

require('dotenv').config();


const config = {
  name: 'WatchaDoingDB',
  connector: 'mysql',
  url: process.env.DB_URL,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
}

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class WatchaDoingDbDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'WatchaDoingDB';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.WatchaDoingDB', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
