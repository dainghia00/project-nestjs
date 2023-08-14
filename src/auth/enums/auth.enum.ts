export enum EPermissions {
  SUPER_ADMIN_READ = 'super_admin: read',
  SUPER_ADMIN_CREATE = 'super_admin: create',
  SUPER_ADMIN_UPDATE = 'super_admin: update',
  SUPER_ADMIN_DELETE = 'super_admin: delete',
  SUPER_ADMIN_MANAGE = 'super_admin: manage',

  ADMIN_READ = 'admin: read',
  ADMIN_CREATE = 'admin: create',
  ADMIN_UPDATE = 'admin: update',
  ADMIN_DELETE = 'admin: delete',

  USER_READ = 'user: read',
}

export enum ERoles {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  USER = 'user',
}
