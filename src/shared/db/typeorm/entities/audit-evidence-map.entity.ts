import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Audit } from './audit.entity';
import { Evidence } from './evidence.entity';

@Entity('audit_evidence_map')
export class AuditEvidenceMap {
  @PrimaryColumn({ type: 'uuid' })
  auditId: string;

  @PrimaryColumn({ type: 'uuid' })
  evidenceId: string;

  // Relations
  @ManyToOne(() => Audit, (audit) => audit.evidenceMappings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'auditId' })
  audit: Audit;

  @ManyToOne(() => Evidence, (evidence) => evidence.auditMappings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'evidenceId' })
  evidence: Evidence;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
