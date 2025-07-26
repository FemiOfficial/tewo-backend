import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Framework } from './framework.entity';
import { ControlCategory } from './control-category.entity';
import { OrganizationControl } from './organization-control.entity';
import { PolicyControlMap } from './policy-control-map.entity';

@Entity('controls')
export class Control {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  frameworkId: number;

  @Column({ type: 'int' })
  categoryId: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  controlIdString: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  // Relations
  @ManyToOne(() => Framework, (framework) => framework.controls)
  @JoinColumn({ name: 'framework_id' })
  framework: Framework;

  @ManyToOne(() => ControlCategory, (category) => category.controls)
  @JoinColumn({ name: 'category_id' })
  category: ControlCategory;

  @OneToMany(
    () => OrganizationControl,
    (organizationControl) => organizationControl.control,
  )
  organizationControls: OrganizationControl[];

  @OneToMany(() => PolicyControlMap, (policyMap) => policyMap.control)
  policyMappings: PolicyControlMap[];
}
