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
import { Field, ObjectType } from '@nestjs/graphql';
import { ControlCategory } from './control-category.entity';
import { OrganizationFrameworks } from './organization-frameworks.entity';

export enum FrameworkStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DEPRECATED = 'deprecated',
}

@Entity('frameworks')
@ObjectType()
export class Framework {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Field()
  @Column({ type: 'varchar', length: 255, default: FrameworkStatus.ACTIVE })
  status: FrameworkStatus;

  @Field()
  @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
  shortCode: string;

  @Field()
  @Column({ type: 'jsonb', default: [] })
  region: string[];

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @Field(() => [ControlCategory])
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
