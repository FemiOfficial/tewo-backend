import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Control } from './control.entity';

@Entity('control_categories')
export class ControlCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  // Relations
  @OneToMany(() => Control, (control) => control.category)
  controls: Control[];
}
