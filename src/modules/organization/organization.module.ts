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
import { OrgControlService } from './services/org-control.service';
import { OrgControlQueryResolver } from './gql/query/org-control.query.resolver';
import { OrgControlMutationResolver } from './gql/mutation/org-control.mutation.resolver';
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
    OrgControlService,
    TokenService,
    JwtService,
    OrgControlQueryResolver,
    OrgControlMutationResolver,
  ],
})
export class OrganizationModule {}
