import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Organization } from './organization.entity';
import { ScanResult } from './scan-result.entity';

@Entity('organization_integrations')
export class OrganizationIntegration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  organizationId: string;

  @Column({ type: 'varchar', length: 50 })
  integrationType: string;

  @Column({ type: 'text' })
  encryptedCredentials: string;

  @Column({ type: 'varchar', length: 50, default: 'disconnected' })
  status: string;

  @Column({ type: 'timestamptz', nullable: true })
  lastSyncAt: Date;

  // Relations
  @ManyToOne(() => Organization, (organization) => organization.integrations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @OneToMany(() => ScanResult, (scanResult) => scanResult.integration)
  scanResults: ScanResult[];
}
