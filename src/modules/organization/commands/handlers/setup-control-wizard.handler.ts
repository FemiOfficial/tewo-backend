import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SetupControlWizardCommand } from '../impl/setup-control-wizard.command';
import { OrgControlService } from '../../org-control/org-control.service';
import { DataSource, IsNull } from 'typeorm';
import {
  ControlWizard,
  ControlWizardType,
} from 'src/shared/db/typeorm/entities/control-wizard/control-wizard.entity';
import { BadRequestException } from '@nestjs/common';
import { OrganizationControl } from 'src/shared/db/typeorm/entities/organization-control.entity';
import { ControlWizardSchedule } from 'src/shared/db/typeorm/entities/control-wizard/control-wizard-schedule.entity';
import { ControlWizardApproval } from 'src/shared/db/typeorm/entities/control-wizard/control-wizard-approval.entity';

@CommandHandler(SetupControlWizardCommand)
export class SetupControlWizardHandler
  implements ICommandHandler<SetupControlWizardCommand>
{
  constructor(
    private readonly orgControlService: OrgControlService,
    private readonly dataSource: DataSource,
  ) {}

  async execute(command: SetupControlWizardCommand) {
    const { organizationId, controlWizardId } = command;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const organizationHasControlWizard = await queryRunner.manager.findOne(
        ControlWizard,
        {
          where: {
            organizationId,
            id: controlWizardId,
            type: ControlWizardType.DEFAULT,
          },
        },
      );

      if (organizationHasControlWizard) {
        throw new BadRequestException(
          'Wizard already assigned to organization, update the wizard settings cusotm to the organization need accordingly',
        );
      }

      const defaultControlWizard = await queryRunner.manager.findOne(
        ControlWizard,
        {
          where: { id: controlWizardId, type: ControlWizardType.DEFAULT },
          relations: [
            'category',
            'control',
            'forms',
            'forms.fields',
            'forms.fields.options',
            'schedules',
            'approvals',
            'documents',
            'reports',
            'schedules',
          ],
        },
      );

      if (!defaultControlWizard) {
        throw new BadRequestException(
          'Default control wizard not found for this category',
        );
      }

      // now map the default control wizard with the organization
      const controlWizard = await queryRunner.manager.save(ControlWizard, {
        organizationId,
        categoryId: defaultControlWizard.categoryId,
        frameworkId: defaultControlWizard.frameworkId,
        title: defaultControlWizard.title,
        description: defaultControlWizard.description,
        type: defaultControlWizard.type,
        status: defaultControlWizard.status,
        mode: defaultControlWizard.mode,
        isRecurring: defaultControlWizard.isRecurring,
        requiresApproval: defaultControlWizard.requiresApproval,
        requiresEvidence: defaultControlWizard.requiresEvidence,
        generatesReport: defaultControlWizard.generatesReport,
        categorySpecificConfig: defaultControlWizard.categorySpecificConfig,
        metadata: defaultControlWizard.metadata,
        type: ControlWizardType.CUSTOM,
      });

      // create the control wizard schedule
      await queryRunner.manager.save(
        ControlWizardSchedule,
        defaultControlWizard.schedules.map((schedule) => ({
          ...schedule,
          controlWizardId: controlWizard.id,
        })),
      );
      // create the control wizard approvals
      await queryRunner.manager.save(
        ControlWizardApproval,
        defaultControlWizard.approvals.map((approval) => ({
          ...approval,
          controlWizardId: controlWizard.id,
        })),
      );
      // create the control wizard documents
      // create the control wizard forms
      // create the control wizard fields

      await queryRunner.commitTransaction();
      return controlWizard;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
