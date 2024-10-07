import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { JwtGuard } from './guards/jwt.guard';
import { JwtStrategy } from './auth/strategies/jwt.startegy';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '././.env'
  }),
  MongooseModule.forRoot(process.env.CONNECTION_STRING),
    UsersModule,
    AuthModule,
    PostsModule
  ],
  providers: [
  {
    provide: APP_GUARD,
    useClass: JwtGuard
  },
    JwtStrategy],
})
export class AppModule { }
