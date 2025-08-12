import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Control } from './control.entity';
import { Audit } from './audit.entity';

@Entity('frameworks')
export class Framework {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
  shortCode: string;

  @Column({ type: 'varchar', length: 2 })
  region: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @OneToMany(() => Control, (control) => control.framework)
  controls: Control[];

  @OneToMany(() => Audit, (audit) => audit.framework)
  audits: Audit[];
}
