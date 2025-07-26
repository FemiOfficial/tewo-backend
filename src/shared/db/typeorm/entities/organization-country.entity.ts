import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Organization } from './organization.entity';
import { ServiceCountry } from './service-countries.entity';

export enum OrganizationCountryStatus {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  INACTIVE = 'inactive',
}

@Entity('organization_countries')
export class OrganizationCountry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  organizationId: string;

  @Column({ type: 'uuid' })
  serviceCountryId: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({
    type: 'varchar',
    length: 50,
    default: OrganizationCountryStatus.PRIMARY,
  })
  status: OrganizationCountryStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  // Relations
  @ManyToOne(
    () => Organization,
    (organization) => organization.organizationCountries,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(
    () => ServiceCountry,
    (serviceCountry) => serviceCountry.organizationCountries,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'service_country_id' })
  serviceCountry: ServiceCountry;
}
