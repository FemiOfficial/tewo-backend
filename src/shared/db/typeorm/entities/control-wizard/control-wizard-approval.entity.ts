import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ControlWizard } from './control-wizard.entity';
import { ControlWizardApprovalStage } from './control-wizard-approval-stage.entity';

export enum ApprovalType {
  SEQUENTIAL = 'sequential', // Approvers must approve in order
  PARALLEL = 'parallel', // All approvers can approve simultaneously
  ANY_ONE = 'any_one', // Any one approver can approve
  MAJORITY = 'majority', // Majority of approvers must approve
  ALL = 'all', // All approvers must approve
}

export enum ApprovalStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

@Entity('control_wizard_approvals')
export class ControlWizardApproval {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  controlWizardId: string;

  @Column({ type: 'enum', enum: ApprovalType })
  type: ApprovalType;

  @Column({
    type: 'enum',
    enum: ApprovalStatus,
    default: ApprovalStatus.PENDING,
  })
  status: ApprovalStatus;

  @Column({ type: 'jsonb', nullable: true })
  approvalConfig: {
    requireComments: boolean;
    allowDelegation: boolean;
    autoEscalation: boolean;
    escalationHours?: number;
    reminderIntervals?: number[]; // hours
    maxRevisions?: number;
  };

  @Column({ type: 'jsonb', nullable: true })
  escalationConfig: {
    escalationLevels: {
      level: number;
      approvers: string[];
      timeframe: number; // hours
    }[];
  };

  @Column({ type: 'uuid', nullable: true })
  currentStageId: string;

  @Column({ type: 'timestamp', nullable: true })
  dueDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => ControlWizard, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'controlWizardId' })
  controlWizard: ControlWizard;

  @OneToMany(() => ControlWizardApprovalStage, (stage) => stage.approval)
  stages: ControlWizardApprovalStage[];
}
