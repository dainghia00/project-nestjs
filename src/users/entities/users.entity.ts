import { BaseEntities } from 'src/db/base.entity';
import { RolesEntity } from 'src/roles/entities/roles.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity('users')
export class UsersEntity extends BaseEntities {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @ManyToOne(() => RolesEntity, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role: RolesEntity;

  @Column({ name: 'role_id' })
  roleId: string;

  toJSON() {
    delete this.password;
    return this;
  }
}
