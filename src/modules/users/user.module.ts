import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule as CustomTypeOrmModule } from '../../shared/db/typeorm/typeorm.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersController, UsersService } from './';
import { UserCommandHandlers } from './commands/handlers';
import {
  User,
  UserRoles,
  Role,
  AccessCode,
  Organization,
  OrganizationCountry,
  ServiceCountry,
  Invite,
} from '../../shared/db/typeorm/entities';

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CustomTypeOrmModule,
    TypeOrmModule.forFeature([
      User,
      UserRoles,
      Role,
      AccessCode,
      Organization,
      OrganizationCountry,
      ServiceCountry,
      Invite,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, ...UserCommandHandlers],
})
export class UserModule {}
