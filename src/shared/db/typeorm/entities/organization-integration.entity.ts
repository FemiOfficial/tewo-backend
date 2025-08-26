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
import { ObjectType } from '@nestjs/graphql';
import { Field } from '@nestjs/graphql';

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

  @Field()
  @Column({ type: 'varchar', length: 50, default: 'disconnected' })
  status: string;

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
