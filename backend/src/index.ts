import 'reflect-metadata'
import { __prod__, COOKIE_NAME } from "./constants"
import express from 'express'
import { ApolloServer } from "apollo-server-express"
import { buildSchema } from "type-graphql"
import { HelloResolver } from "./resolvers/hello"
import { PostResolver } from './resolvers/post/PostResolver'
import { UserResolver } from './resolvers/user/UserResolver'
import Redis from 'ioredis'
import session from 'express-session'
import connectRedis from 'connect-redis'
import cors from 'cors'
import { createConnection } from 'typeorm'
import { Post } from './entities/Post'
import { User } from './entities/User'
import { join as pathJoin } from 'path'

const main = async () => {
  const conn = await createConnection({
    type: 'postgres',
    database: 'lireddit2',
    username: 'postgres',
    password: 'docker',
    logging: true,
    synchronize: true,
    migrations: [pathJoin(__dirname, './migrations/*')],
    entities: [User, Post]
  })

  await conn.runMigrations()

  const app = express()

  const RedisStore = connectRedis(session)
  const redisClient = new Redis()

  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }))

  app.use(
    session({
      store: new RedisStore({
        client: redisClient,
        disableTouch: true
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 2, // 2 years
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__
      },
      name: COOKIE_NAME,
      saveUninitialized: false,
      secret: 'jnibhuvgkycfctyvgkujbhlkj',
      resave: false,
    })
  )

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false
    }),
    context: ({ req, res }) => ({
      redis: redisClient,
      req,
      res
    })
  })

  apolloServer.applyMiddleware({
    app,
    cors: false
  })

  return app
}

export default main