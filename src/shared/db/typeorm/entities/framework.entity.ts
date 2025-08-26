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
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ControlCategory } from './control-category.entity';
import { OrganizationFrameworks } from './organization-frameworks.entity';

export enum FrameworkStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DEPRECATED = 'deprecated',
}

registerEnumType(FrameworkStatus, {
  name: 'FrameworkStatus',
  description: 'The status of a framework',
});

@Entity('frameworks')
@ObjectType()
export class Framework {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Field(() => FrameworkStatus)
  @Column({ type: 'varchar', length: 255, default: FrameworkStatus.ACTIVE })
  status: FrameworkStatus;

  @Field()
  @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
  shortCode: string;

  @Field(() => [String])
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
