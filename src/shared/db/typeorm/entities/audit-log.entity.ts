import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Organization } from './organization.entity';
import { User } from './user.entity';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'uuid' })
  organizationId: string;

  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @Column({ type: 'varchar', length: 100 })
  actionType: string;

  @Column({ type: 'uuid', nullable: true })
  targetEntityId: string;

  @Column({ type: 'jsonb', nullable: true })
  details: Record<string, any>;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Organization, (organization) => organization.auditLogs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @ManyToOne(() => User, (user) => user.auditLogs)
  @JoinColumn({ name: 'userId' })
  user: User;
}
