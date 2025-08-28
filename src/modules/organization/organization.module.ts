import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule as CustomTypeOrmModule } from '../../shared/db/typeorm/typeorm.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import {
  User,
  Organization,
  OrganizationCountry,
  OrganizationIntegration,
} from '../../shared/db/typeorm/entities';
import { TokenService } from '../token/token.service';
import { JwtService } from '@nestjs/jwt';
import { OrganizationController } from './rest';
import {
  Framework,
  Control,
  ControlCategory,
  OrganizationFrameworks,
  OrganizationControl,
  SystemIntegration,
  ControlWizard,
  ControlWizardSchedule,
  ControlWizardForm,
  ControlWizardFormField,
  ControlWizardDocument,
} from '../../shared/db/typeorm/entities';
import { orgGqlResolvers } from './gql';
import { orgServices } from './services';

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CustomTypeOrmModule,
    TypeOrmModule.forFeature([
      User,
      Organization,
      OrganizationCountry,
      Framework,
      Control,
      ControlCategory,
      ControlWizard,
      ControlWizardSchedule,
      ControlWizardForm,
      ControlWizardFormField,
      ControlWizardDocument,
      OrganizationFrameworks,
      OrganizationControl,
      OrganizationIntegration,
      SystemIntegration,
    ]),
  ],
  controllers: [OrganizationController],
  providers: [TokenService, JwtService, ...orgGqlResolvers, ...orgServices],
})
export class OrganizationModule {}
