import path from 'path'
import { Post } from "./entities/Post";
import { __prod__ } from "./constants";
import { MikroORM } from "@mikro-orm/core"
import { User } from './entities/User';

export default {
  migrations: {
    path: path.resolve(__dirname, './migrations'),
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
  dbName: 'lireddit_db',
  type: 'postgresql',
  user: 'postgres',
  password: 'docker',
  debug: !__prod__
} as Parameters<typeof MikroORM.init>[0]