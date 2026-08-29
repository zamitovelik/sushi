import "dotenv/config";
import { defineConfig, env } from "prisma/config";

/**
 * Конфигурация Prisma CLI (миграции, generate, studio).
 * В Prisma 7 строка подключения переехала сюда из schema.prisma;
 * приложению в рантайме она приходит через driver adapter.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
