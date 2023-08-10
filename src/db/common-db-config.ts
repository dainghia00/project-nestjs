export const commonDbConfig = {
  entities: ['build/**/*.entity.js'],
  migrationsRun: true,
  migrations: ['build/**/migrations/*.js'],
  synchronize: false, // turning this on will delete data, we must migrate on schema changes
  logging: false,
};
