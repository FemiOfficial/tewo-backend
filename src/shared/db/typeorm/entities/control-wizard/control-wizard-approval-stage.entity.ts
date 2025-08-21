import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ControlWizardApproval } from './control-wizard-approval.entity';
import { User } from '../user.entity';

export enum StageStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SKIPPED = 'skipped',
}

@Entity('control_wizard_approval_stages')
export class ControlWizardApprovalStage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  approvalId: string;

  @Column({ type: 'int' })
  stageNumber: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: StageStatus, default: StageStatus.PENDING })
  status: StageStatus;

  @Column({ type: 'jsonb' })
  approvers: {
    userId: string;
    role: string;
    isRequired: boolean;
    order?: number;
  }[];

  @Column({ type: 'int', nullable: true })
  requiredApprovals: number; // Number of approvals needed to proceed

  @Column({ type: 'int', nullable: true })
  timeoutHours: number; // Auto-escalation timeout

  @Column({ type: 'jsonb', nullable: true })
  escalationConfig: {
    escalateTo: string[];
    escalateAfterHours: number;
    escalationMessage?: string;
  };

  @Column({ type: 'timestamp', nullable: true })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  dueDate: Date;

  @Column({ type: 'jsonb', nullable: true })
  stageResult: {
    approvedBy: string[];
    rejectedBy: string[];
    comments: Record<string, string>;
    attachments?: string[];
  };

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => ControlWizardApproval, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'approvalId' })
  approval: ControlWizardApproval;
}
