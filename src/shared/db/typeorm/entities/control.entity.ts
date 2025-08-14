import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { ControlCategory } from './control-category.entity';
import { OrganizationControl } from './organization-control.entity';
import { PolicyControlMap } from './policy-control-map.entity';

@Entity('controls')
export class Control {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  categoryId: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  controlIdString: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => ControlCategory, (category) => category.controls)
  @JoinColumn({ name: 'categoryId' })
  category: ControlCategory;

  @OneToMany(
    () => OrganizationControl,
    (organizationControl) => organizationControl.control,
  )
  organizationControls: OrganizationControl[];

  @OneToMany(() => PolicyControlMap, (policyMap) => policyMap.control)
  policyMappings: PolicyControlMap[];
}
