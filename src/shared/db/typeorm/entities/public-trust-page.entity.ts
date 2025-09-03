import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Organization } from './organization.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity('public_trust_pages')
@ObjectType()
export class PublicTrustPage {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column({ type: 'uuid' })
  organizationId: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 100, unique: true })
  publicSlug: string;

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  passwordHash: string;

  @Column({ type: 'jsonb', nullable: true })
  visibleContent: Record<string, any>;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @Field(() => Organization)
  @ManyToOne(
    () => Organization,
    (organization) => organization.publicTrustPages,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;
}
