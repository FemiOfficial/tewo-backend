import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum AccessCodeType {
  SIGNUP = 'signup',
  RESET_PASSWORD = 'reset-password',
  VERIFY_EMAIL = 'verify-email',
  EMPLOYEE_INVITE_SIGNUP = 'employee-invite-signup',
}

@Entity('access_codes')
export class AccessCode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  code: string;

  @Column({ type: 'varchar', length: 255 })
  type: AccessCodeType;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  organization: string;

  @Column({ type: 'boolean', default: false })
  isUsed: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column({ type: 'date' })
  expiresAt: Date;
}
