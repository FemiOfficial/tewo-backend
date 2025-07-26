import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Company } from './company.entity';
import { Framework } from './framework.entity';
import { AuditEvidenceMap } from './audit-evidence-map.entity';

@Entity('audits')
export class Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  companyId: string;

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
  @ManyToOne(() => Company, (company) => company.audits, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ManyToOne(() => Framework, (framework) => framework.audits)
  @JoinColumn({ name: 'framework_id' })
  framework: Framework;

  @OneToMany(() => AuditEvidenceMap, (evidenceMap) => evidenceMap.audit)
  evidenceMappings: AuditEvidenceMap[];
}
