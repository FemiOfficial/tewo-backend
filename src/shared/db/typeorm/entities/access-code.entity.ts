import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('access_codes')
export class AccessCode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  code: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'boolean', default: false })
  isUsed: boolean;

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz' })
  updatedAt: Date;

  @Column({ type: 'timestamptz' })
  expiresAt: Date;
}
