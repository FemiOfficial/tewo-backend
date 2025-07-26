import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Company } from './company.entity';
import { ScanResult } from './scan-result.entity';

@Entity('company_integrations')
export class CompanyIntegration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  companyId: string;

  @Column({ type: 'varchar', length: 50 })
  integrationType: string;

  @Column({ type: 'text' })
  encryptedCredentials: string;

  @Column({ type: 'varchar', length: 50, default: 'disconnected' })
  status: string;

  @Column({ type: 'timestamptz', nullable: true })
  lastSyncAt: Date;

  // Relations
  @ManyToOne(() => Company, (company) => company.integrations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @OneToMany(() => ScanResult, (scanResult) => scanResult.integration)
  scanResults: ScanResult[];
}
