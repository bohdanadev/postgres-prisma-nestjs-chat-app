import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'node:path';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { ServeStaticModule } from '@nestjs/serve-static';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TokenService } from './token/token.service';
import { ChatroomModule } from './chatroom/chatroom.module';
import { LiveChatroomModule } from './live-chatroom/live-chatroom.module';

const pubSub = new RedisPubSub({
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
    retryStrategy: (times) => {
      return Math.min(times * 50, 2000);
    },
  },
});


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
    }),
    AuthModule,
    UserModule,
    GraphQLModule.forRootAsync({
      imports: [ConfigModule, AppModule],
      inject: [ConfigService],
      driver: ApolloDriver,
      useFactory: async (
        configService: ConfigService,
        tokenService: TokenService
      ) => {
        return {
          installSubscriptionHandlers: true,
          playground: true,
          autoSchemaFile: path.join(process.cwd(), 'src/schema.gql'),
          sortSchema: true,
          subscriptions: {
            'graphql-ws': true,
            'subscriptions-transport-ws': true,
          },
          onConnect: (connectionParams) => {
            const token = tokenService.extractToken(connectionParams);

            if (!token) {
              throw new Error('Token not provided');
            }
            const user = tokenService.validateToken(token);
            if (!user) {
              throw new Error('Invalid token');
            }
            return { user };
          },
          context: ({ req, res, connection }) => {
            if (connection) {
              return { req, res, user: connection.context.user, pubSub };
            }
            return { req, res };
          },
        };
      },
    }),
    ChatroomModule,
    LiveChatroomModule,
  ],
  controllers: [AppController],
  providers: [AppService, TokenService],
})
export class AppModule {}
