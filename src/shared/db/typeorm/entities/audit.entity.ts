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
import { AuditEvidenceMap } from './audit-evidence-map.entity';
import { OrganizationFrameworks } from './organization-frameworks.entity';

@Entity('audits')
export class Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  organizationId: string;

  @Column({ type: 'int' })
  organizationFrameworkId: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 50, default: 'draft' })
  status: string;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Organization, (organization) => organization.audits, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @ManyToOne(
    () => OrganizationFrameworks,
    (orgFramework) => orgFramework.audits,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'organizationFrameworkId' })
  organizationFramework: OrganizationFrameworks;

  @OneToMany(() => AuditEvidenceMap, (evidenceMap) => evidenceMap.audit)
  evidenceMappings: AuditEvidenceMap[];
}
