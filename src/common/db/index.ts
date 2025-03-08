import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MongoosePlugin } from './plugins';

// eslint-disable-next-line @typescript-eslint/no-var-requires
// const mongoose_delete = require('mongoose-delete');

export * from './definitions';
export * from './mongo-repo';
export * from './plugins';

@Module({})
export class MongoosePluggedModule {
  static forRoot(uri: string) {
    return {
      module: MongoosePluggedModule,
      imports: [
        MongooseModule.forRoot(uri, {
          connectionFactory: (connection) => {
            connection.plugin(MongoosePlugin);
            return connection;
          },
        }),
      ],
    };
  }
}
