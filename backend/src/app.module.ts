import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'node:path';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    GraphQLModule.forRootAsync({
      imports: [ConfigModule, AppModule],
      inject: [ConfigService],
      driver: ApolloDriver,
      useFactory: async (configService: ConfigService) => {
        return {
          playground: true,
          autoSchemaFile: path.join(process.cwd(), 'src/schema.gql'),
          sortSchema: true,
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
