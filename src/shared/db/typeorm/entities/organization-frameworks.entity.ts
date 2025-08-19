import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Organization } from './organization.entity';
import { Audit } from './audit.entity';
import { Framework } from './framework.entity';

@Entity()
export class OrganizationFrameworks {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizationId: string;

  @Column({ type: 'int' })
  frameworkId: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(
    () => Organization,
    (organization) => organization.organizationFrameworks,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @ManyToOne(() => Framework, (framework) => framework.organizationFrameworks)
  @JoinColumn({ name: 'frameworkId' })
  framework: Framework;

  @OneToMany(() => Audit, (audit) => audit.organizationFramework, {
    onDelete: 'CASCADE',
  })
  audits: Audit[];
}
