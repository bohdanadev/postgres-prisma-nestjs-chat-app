import { ConfigService } from '@nestjs/config/dist/config.service';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { User } from '../user/user.type';
import { Config, RedisConfig } from 'src/config/config.type';

@Injectable()
export class LiveChatroomService {
  private redisClient: Redis;
  private readonly redisConfig: RedisConfig;

  constructor(private readonly configService: ConfigService<Config>) {
    this.redisConfig = configService.get<RedisConfig>('redis');

    this.redisClient = new Redis({
      host: this.redisConfig.host,
      port: this.redisConfig.port,
      password: this.redisConfig.password,
    });
  }

  async addLiveUserToChatroom(chatroomId: number, user: User): Promise<void> {
    const existingLiveUsers = await this.getLiveUsersForChatroom(chatroomId);

    const existingUser = existingLiveUsers.find(
      (liveUser) => liveUser.id === user.id,
    );
    if (existingUser) {
      return;
    }
    await this.redisClient.sadd(
      `liveUsers:chatroom:${chatroomId}`,
      JSON.stringify(user),
    );
  }

  async removeLiveUserFromChatroom(
    chatroomId: number,
    user: User,
  ): Promise<void> {
    await this.redisClient
      .srem(`liveUsers:chatroom:${chatroomId}`, JSON.stringify(user))
      .catch((err) => {
        console.log('removeLiveUserFromChatroom error', err);
      })
      .then((res) => {
        console.log('removeLiveUserFromChatroom res', res);
      });
  }
  async getLiveUsersForChatroom(chatroomId: number): Promise<User[]> {
    const users = await this.redisClient.smembers(
      `liveUsers:chatroom:${chatroomId}`,
    );

    return users.map((user) => JSON.parse(user));
  }
}
