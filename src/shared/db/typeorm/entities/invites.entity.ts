import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Organization } from './organization.entity';

export enum InviteStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

@Entity('invites')
export class Invite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  firstName: string;

  @Column({ type: 'varchar', length: 255 })
  lastName: string;

  @Column({ type: 'varchar', length: 255 })
  organizationId: string;

  @Column({ type: 'varchar', length: 255 })
  role: string;

  @Column({
    type: 'varchar',
    length: 255,
    default: InviteStatus.PENDING,
  })
  status: InviteStatus;

  @Column()
  expiresAt: Date;

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => Organization, (organization) => organization.invites)
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;
}
