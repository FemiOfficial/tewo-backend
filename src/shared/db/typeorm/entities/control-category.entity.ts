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
import { ObjectType } from '@nestjs/graphql';
import { Field } from '@nestjs/graphql';

@Entity('control_categories')
@ObjectType()
export class ControlCategory {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  // Relations
  @Field(() => [Control])
  @OneToMany(() => Control, (control) => control.category)
  controls: Control[];

  // Relations
  @Field(() => [Framework])
  @ManyToMany(() => Framework, (framework) => framework.controlCategories)
  @JoinTable({ name: 'control_categories_frameworks_map' })
  frameworks: Framework[];

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
