import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  Body,
} from '@nestjs/common';
import { ControlService } from '../services/control.service';
import { AuthGuard } from 'src/modules/token/guard/jwt.guard';
import { AuthenticatedRequest } from 'src/modules/token/guard/types';
import { SystemIntegrationCategory } from 'src/shared/db/typeorm/entities';
import { UpsertControlWizardDocumentDto } from '../dto/org-controls/document/document.dto';

@Controller('organization/control/wizard')
@UseGuards(AuthGuard)
export class OrgControlController {
  constructor(private readonly orgControlService: ControlService) {}

  @Get('system-integrations/:category')
  getSystemIntegrations(
    @Param('category') category: SystemIntegrationCategory,
  ) {
    return this.orgControlService.getSystemIntegrations(category);
  }

  @Get('control-wizards/:categoryId')
  getControlWizardByCategory(
    @Param('categoryId') categoryId: string,
    @Query('isDefault') isDefault: boolean,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.orgControlService.getControlWizardByCategory(
      categoryId,
      isDefault,
      req.organization.id,
    );
  }

  @Get('control-wizard-schedules/:controlWizardId')
  getControlWizardSchedules(
    @Param('controlWizardId') controlWizardId: string,
    @Query('isDefault') isDefault: boolean,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.orgControlService.getControlWizardSchedules(
      controlWizardId,
      isDefault,
      req.organization.id,
    );
  }

  @Get('control-wizard-forms/:controlWizardId')
  getControlWizardForms(
    @Param('controlWizardId') controlWizardId: string,
    @Query('isDefault') isDefault: boolean,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.orgControlService.getControlWizardForms(
      controlWizardId,
      isDefault,
      req.organization.id,
    );
  }

  @Get('control-wizard-form-fields/:controlWizardId/:formId')
  getControlWizardFormFields(
    @Param('controlWizardId') controlWizardId: string,
    @Param('formId') formId: string,
    @Query('isDefault') isDefault: boolean,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.orgControlService.getControlWizardFormFields(
      controlWizardId,
      formId,
      isDefault,
      req.organization.id,
    );
  }

  @Get('control-wizard-documents/:controlWizardId')
  getControlWizardDocuments(
    @Param('controlWizardId') controlWizardId: string,
    @Query('isDefault') isDefault: boolean,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.orgControlService.getControlWizardDocuments(
      controlWizardId,
      isDefault,
      req.organization.id,
    );
  }

  @Post('control-wizard-documents/:controlWizardId')
  upsertControlWizardDocument(
    @Param('controlWizardId') controlWizardId: string,
    @Body() upsertControlWizardDocumentDto: UpsertControlWizardDocumentDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.orgControlService.upsertControlWizardDocument(
      req.organization.id,
      controlWizardId,
      upsertControlWizardDocumentDto,
    );
  }
}
