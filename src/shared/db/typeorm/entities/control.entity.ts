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
import { ObjectType } from '@nestjs/graphql';
import { Field } from '@nestjs/graphql';

@Entity('controls')
@ObjectType()
export class Control {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: 'int' })
  categoryId: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  controlIdString: string;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Field()
  @Column({ type: 'text' })
  description: string;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Field(() => ControlCategory)
  @ManyToOne(() => ControlCategory, (category) => category.controls)
  @JoinColumn({ name: 'categoryId' })
  category: ControlCategory;

  @Field(() => [OrganizationControl])
  @OneToMany(
    () => OrganizationControl,
    (organizationControl) => organizationControl.control,
  )
  organizationControls: OrganizationControl[];

  @OneToMany(() => PolicyControlMap, (policyMap) => policyMap.control)
  policyMappings: PolicyControlMap[];
}
