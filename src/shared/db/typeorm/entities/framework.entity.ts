import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { ControlCategory } from './control-category.entity';
import { OrganizationFrameworks } from './organization-frameworks.entity';

@Entity('frameworks')
export class Framework {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
  shortCode: string;

  @Column({ type: 'jsonb', default: [] })
  region: string[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @ManyToMany(
    () => ControlCategory,
    (controlCategory) => controlCategory.frameworks,
  )
  @JoinTable({ name: 'control_categories_frameworks_map' })
  controlCategories: ControlCategory[];

  @OneToMany(
    () => OrganizationFrameworks,
    (orgFramework) => orgFramework.framework,
  )
  organizationFrameworks: OrganizationFrameworks[];
}
