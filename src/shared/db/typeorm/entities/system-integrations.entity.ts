import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('system_integrations')
export class SystemIntegrations {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  key: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({ type: 'varchar', length: 50, default: 'active' })
  status: string;
}
