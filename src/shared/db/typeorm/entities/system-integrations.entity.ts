import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ObjectType, Field } from '@nestjs/graphql';

import { registerEnumType } from '@nestjs/graphql';

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

registerEnumType(SystemIntegrationCategory, {
  name: 'SystemIntegrationCategory',
  description: 'The category of system integration',
});
@Entity('system_integrations')
@ObjectType()
export class SystemIntegration {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @Field()
  @Column({ type: 'varchar', length: 50, unique: true })
  key: string;

  @Field(() => SystemIntegrationCategory)
  @Column({ type: 'varchar', length: 50 })
  category: SystemIntegrationCategory;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Field()
  @Column({ type: 'varchar', length: 50, default: 'active' })
  status: string;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
