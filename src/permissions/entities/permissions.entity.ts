import { EPermissions } from 'src/auth/enums/auth.enum';
import { BaseEntities } from 'src/db/base.entity';
import { RolesEntity } from 'src/roles/entities/roles.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

@Entity('permissions')
export class PermissionsEntity extends BaseEntities {
  @Column({
    type: 'enum',
    enum: EPermissions,
    unique: true,
  })
  permission: EPermissions;

  @ManyToMany(() => RolesEntity, (role) => role.permissions)
  @JoinTable(
    {
      name: 'role_permissions_permission',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    }
    }
  )
  roles: RolesEntity[];

  // @Column({ name: 'role_id', nullable: true })
  // roleId: string;
}
