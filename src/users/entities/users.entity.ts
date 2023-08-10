import { EPermissions } from 'src/auth/enums/auth.enum';
import { BaseEntities } from 'src/db/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('users')
export class UsersEntity extends BaseEntities {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ default: false, name: 'super_admin' })
  isSuperAdmin: boolean;

  @Column({
    type: 'enum',
    enum: EPermissions,
    array: true,
    default: EPermissions.USER,
  })
  permissions: EPermissions[];

  toJSON() {
    delete this.password;
    return this;
  }
}
