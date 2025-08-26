import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule as CustomTypeOrmModule } from '../../shared/db/typeorm/typeorm.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import {
  User,
  Organization,
  OrganizationCountry,
} from '../../shared/db/typeorm/entities';
import { TokenService } from '../token/token.service';
import { JwtService } from '@nestjs/jwt';
import { OrganizationController, OrgControlController } from './rest';
import { OrganizationService } from './services/organization.service';
import { ControlService } from './services/control.service';
import { ControlQueryResolver } from './gql/query/control.query.resolver';
import { ControlMutationResolver } from './gql/mutation/control.mutation.resolver';
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
      SystemIntegration,
    ]),
  ],
  controllers: [OrganizationController, OrgControlController],
  providers: [
    OrganizationService,
    ControlService,
    TokenService,
    JwtService,
    ControlQueryResolver,
    ControlMutationResolver,
  ],
})
export class OrganizationModule {}
