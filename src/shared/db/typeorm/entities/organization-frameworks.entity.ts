import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Organization } from './organization.entity';
import { Audit } from './audit.entity';
import { Framework } from './framework.entity';
import { ObjectType } from '@nestjs/graphql';
import { Field } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class OrganizationFrameworks {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  organizationId: string;

  @Field()
  @Column({ type: 'int' })
  frameworkId: number;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
  
  @Field()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Field(() => Organization)
  @ManyToOne(
    () => Organization,
    (organization) => organization.organizationFrameworks,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @Field(() => Framework)
  @ManyToOne(() => Framework, (framework) => framework.organizationFrameworks)
  @JoinColumn({ name: 'frameworkId' })
  framework: Framework;

  @OneToMany(() => Audit, (audit) => audit.organizationFramework, {
    onDelete: 'CASCADE',
  })
  audits: Audit[];
}
