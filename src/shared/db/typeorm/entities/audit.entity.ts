import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Organization } from './organization.entity';
import { Framework } from './framework.entity';
import { AuditEvidenceMap } from './audit-evidence-map.entity';

@Entity('audits')
export class Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  organizationId: string;

  @Column({ type: 'int' })
  frameworkId: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 50, default: 'in_progress' })
  status: string;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  // Relations
  @ManyToOne(() => Organization, (organization) => organization.audits, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => Framework, (framework) => framework.audits)
  @JoinColumn({ name: 'framework_id' })
  framework: Framework;

  @OneToMany(() => AuditEvidenceMap, (evidenceMap) => evidenceMap.audit)
  evidenceMappings: AuditEvidenceMap[];
}
