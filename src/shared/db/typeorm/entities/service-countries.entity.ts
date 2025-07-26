import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrganizationCountry } from './organization-country.entity';

@Entity('service_countries')
export class ServiceCountry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  code: string;

  @Column({ type: 'varchar', length: 255 })
  currency: string;

  @Column({ type: 'varchar', length: 255 })
  currencyCode: string;

  @Column({ type: 'varchar', length: 255 })
  currencySymbol: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @OneToMany(
    () => OrganizationCountry,
    (orgCountry) => orgCountry.serviceCountry,
  )
  organizationCountries: OrganizationCountry[];
}
