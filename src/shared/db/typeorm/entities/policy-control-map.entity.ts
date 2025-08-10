import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Policy } from './policy.entity';
import { Control } from './control.entity';

@Entity('policy_control_map')
export class PolicyControlMap {
  @PrimaryColumn({ type: 'uuid' })
  policyId: string;

  @PrimaryColumn({ type: 'int' })
  controlId: number;

  // Relations
  @ManyToOne(() => Policy, (policy) => policy.controlMappings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'policyId' })
  policy: Policy;

  @ManyToOne(() => Control, (control) => control.policyMappings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'controlId' })
  control: Control;
}
