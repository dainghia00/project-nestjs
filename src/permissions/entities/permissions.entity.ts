import { EPermissions } from 'src/auth/enums/auth.enum';
import { BaseEntities } from 'src/db/base.entity';
import { RolesEntity } from 'src/roles/entities/roles.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('permissions')
export class PermissionsEntity extends BaseEntities {
  @Column({
    type: 'enum',
    enum: EPermissions,
    unique: true,
  })
  permission: EPermissions;

  @ManyToOne(() => RolesEntity, (role) => role.permissions)
  @JoinColumn({ name: 'role_id' })
  role: RolesEntity;

  @Column({ name: 'role_id', nullable: true })
  roleId: string;
}
