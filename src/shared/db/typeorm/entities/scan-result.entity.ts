import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CompanyIntegration } from './company-integration.entity';

@Entity('scan_results')
export class ScanResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  integrationId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  vulnerabilityId: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  severity: string;

  @Column({ type: 'text', nullable: true })
  filePath: string;

  @Column({ type: 'varchar', length: 50, default: 'open' })
  status: string;

  @Column({ type: 'text', nullable: true })
  aiRemediationSuggestion: string;

  @CreateDateColumn({ type: 'timestamptz' })
  detectedAt: Date;

  // Relations
  @ManyToOne(
    () => CompanyIntegration,
    (integration) => integration.scanResults,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'integration_id' })
  integration: CompanyIntegration;
}
