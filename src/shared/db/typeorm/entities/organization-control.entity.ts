import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Unique,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Organization } from './organization.entity';
import { Control } from './control.entity';
import { User } from './user.entity';
import { ScheduledEvent } from './scheduled-event.entity';
import { Evidence } from './evidence.entity';
import { ControlCategory } from './control-category.entity';
import { ObjectType } from '@nestjs/graphql';
import { Field } from '@nestjs/graphql';

@Entity('organization_controls')
@ObjectType()
@Unique(['organizationId', 'controlId'])
export class OrganizationControl {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'uuid' })
  organizationId: string;

  @Field()
  @Column({ type: 'int' })
  controlId: number;

  @Field()
  @Column({ type: 'int' })
  categoryId: number;

  @Field()
  @Column({ type: 'varchar', length: 50, default: 'to_do' })
  status: string;

  @Field()
  @Column({ type: 'text', nullable: true })
  notes: string;

  @Field()
  @Column({ type: 'uuid', nullable: true })
  assignedUserId: string;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Field(() => Organization)
  @ManyToOne(
    () => Organization,
    (organization) => organization.organizationControls,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @Field(() => Control)
  @ManyToOne(() => Control, (control) => control.organizationControls)
  @JoinColumn({ name: 'controlId' })
  control: Control;

  @Field(() => ControlCategory)
  @ManyToOne(() => ControlCategory)
  @JoinColumn({ name: 'categoryId' })
  category: ControlCategory;

  @ManyToOne(() => User, (user) => user.assignedControls)
  @JoinColumn({ name: 'assignedUserId' })
  assignedUser: User;

  @OneToMany(() => ScheduledEvent, (event) => event.organizationControl)
  scheduledEvents: ScheduledEvent[];

  @OneToMany(() => Evidence, (evidence) => evidence.organizationControl)
  evidence: Evidence[];
}
