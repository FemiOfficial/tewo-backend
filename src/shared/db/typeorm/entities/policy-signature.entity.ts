import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Policy } from './policy.entity';
import { User } from './user.entity';

@Entity('policy_signatures')
export class PolicySignature {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  policyId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', length: 50, default: 'pending' })
  status: string;

  @Column({ type: 'timestamptz', nullable: true })
  signedAt: Date;

  // Relations
  @ManyToOne(() => Policy, (policy) => policy.signatures, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'policy_id' })
  policy: Policy;

  @ManyToOne(() => User, (user) => user.policySignatures)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
