import { ERoles } from 'src/auth/enums/auth.enum';
import { BaseEntities } from 'src/db/base.entity';
import { PermissionsEntity } from 'src/permissions/entities/permissions.entity';
import { UsersEntity } from 'src/users/entities/users.entity';
import { Column, Entity, JoinColumn, ManyToMany, OneToMany } from 'typeorm';

@Entity('roles')
export class RolesEntity extends BaseEntities {
  @Column({ type: 'enum', enum: ERoles, name: 'role_name', unique: true })
  roleName: ERoles;

  @OneToMany(() => UsersEntity, (users) => users.role)
  @JoinColumn({ name: 'user_id' })
  users: UsersEntity[];

  @ManyToMany(() => PermissionsEntity, (permission) => permission.roles)
  permissions: PermissionsEntity[];
}
