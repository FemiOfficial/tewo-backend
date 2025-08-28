import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Organization } from './organization.entity';
import { User } from './user.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity('audit_logs')
@ObjectType()
export class AuditLog {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column({ type: 'uuid' })
  organizationId: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 100 })
  actionType: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  targetEntityId: string;

  @Column({ type: 'jsonb', nullable: true })
  details: Record<string, any>;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @Field(() => Organization)
  @ManyToOne(() => Organization, (organization) => organization.auditLogs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.auditLogs)
  @JoinColumn({ name: 'userId' })
  user: User;
}
