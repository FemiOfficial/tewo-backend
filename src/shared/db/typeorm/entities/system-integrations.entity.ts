import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum SystemIntegrationCategory {
  CodeRepository = 'code_repository',
  CI_CD = 'ci_cd',
  ContainerRegistry = 'container_registry',
  Database = 'database',
  DevOps = 'devops',
  IdentityAndAccessManagement = 'identity_and_access_management',
  CRM = 'crm',
  Monitoring = 'monitoring',
  Network = 'network',
  Security = 'security',
  Storage = 'storage',
  WebApplication = 'web_application',
  Email = 'email',
  Chat = 'chat',
  Document = 'document',
  Calendar = 'calendar',
  ProjectManagement = 'project_management',
  TimeTracking = 'time_tracking',
  Billing = 'billing',
  Other = 'other',
}
@Entity('system_integrations')
export class SystemIntegration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  key: string;

  @Column({ type: 'varchar', length: 50 })
  category: SystemIntegrationCategory;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({ type: 'varchar', length: 50, default: 'active' })
  status: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
