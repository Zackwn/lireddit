import path from "path";
import { __prod__ } from "../../../src/constants";
import { Post } from "../../../src/entities/Post";
import { User } from "../../../src/entities/User";
import { MikroORM } from "@mikro-orm/core"

const testConfig = {
  migrations: {
    path: path.resolve(__dirname, '..', '..', 'src', './migrations'),
    pattern: /^[\w-]+\d+\.[tj]s$/,
    allOrNothing: true
  },
  cache: {
    enabled: false,
  },
  forceUtcTimezone: true,
  entities: [
    User, Post
  ],
  host: 'localhost',
  dbName: 'lireddit_db_test',
  type: 'postgresql',
  user: 'postgres',
  password: 'docker',
  debug: false
} as Parameters<typeof MikroORM.init>[0]

export const createTestDatabaseConnection = async () => {
  const orm = await MikroORM.init(testConfig)
  return orm
}