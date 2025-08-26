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
import { Organization } from './organization.entity';
import { ScanResult } from './scan-result.entity';
import { SystemIntegration } from './system-integrations.entity';
import { ObjectType, registerEnumType } from '@nestjs/graphql';
import { Field } from '@nestjs/graphql';

export enum OrganizationIntegrationStatus {
  DISCONNECTED = 'disconnected',
  CONNECTED = 'connected',
  ERROR = 'error',
}

registerEnumType(OrganizationIntegrationStatus, {
  name: 'OrganizationIntegrationStatus',
  description: 'The status of the organization automation integration',
});

@Entity('organization_integrations')
@ObjectType()
export class OrganizationIntegration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'uuid' })
  organizationId: string;

  @Field()
  @Column({ type: 'int' })
  systemIntegrationId: number;

  @Field()
  @Column({ type: 'text' })
  encryptedCredentials: string;

  @Field(() => OrganizationIntegrationStatus)
  @Column({ type: 'varchar', length: 50, default: 'disconnected' })
  status: OrganizationIntegrationStatus;

  @Field()
  @Column({ type: 'timestamptz', nullable: true })
  lastSyncAt: Date;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Field(() => Organization)
  @ManyToOne(() => Organization, (organization) => organization.integrations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @Field(() => SystemIntegration)
  @ManyToOne(() => SystemIntegration)
  @JoinColumn({ name: 'systemIntegrationId' })
  systemIntegration: SystemIntegration;

  // @Field(() => [ScanResult])
  @OneToMany(() => ScanResult, (scanResult) => scanResult.integration)
  scanResults: ScanResult[];
}
