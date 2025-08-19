import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { Control } from './control.entity';
import { Framework } from './framework.entity';

@Entity('control_categories')
export class ControlCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  // Relations
  @OneToMany(() => Control, (control) => control.category)
  controls: Control[];

  // Relations
  @ManyToMany(() => Framework, (framework) => framework.controlCategories)
  @JoinTable({ name: 'control_categories_frameworks_map' })
  frameworks: Framework[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
