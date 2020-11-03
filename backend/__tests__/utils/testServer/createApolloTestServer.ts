import { ApolloServer } from "apollo-server-express"
import connectRedis from 'connect-redis'
import express from 'express'
import session from 'express-session'
import Redis from 'ioredis'
import 'reflect-metadata'
import { buildSchema } from "type-graphql"
import { Connection, createConnection } from 'typeorm'
import { TEST_COOKIE_NAME } from '../../../src/constants'
import { Post } from '../../../src/entities/Post'
import { User } from '../../../src/entities/User'
import { HelloResolver } from '../../../src/resolvers/hello'
import { PostResolver } from '../../../src/resolvers/post/PostResolver'
import { UserResolver } from '../../../src/resolvers/user/UserResolver'

export class appoloTest {
  apolloServer: ApolloServer
  expressApp: express.Express
  conn: Connection
  // private orm: MikroORM<IDatabaseDriver<Connection>>
  private redis: Redis.Redis

  public async stop() {
    await this.apolloServer.stop()
    await this.conn.close()
    await this.redis.quit()
    return
  }

  public async undo() {
    await User.delete({})
    await Post.delete({})
  }

  public async init() {
    const conn = await createConnection({
      type: 'postgres',
      database: 'lireddit2_test',
      password: 'docker',
      username: 'postgres',
      synchronize: true,
      logging: false,
      entities: [User, Post]
    })

    this.conn = conn

    const apolloTestServer = new ApolloServer({
      schema: await buildSchema({
        resolvers: [HelloResolver, PostResolver, UserResolver],
        validate: false
      }),
      context: (req) => {
        return {
          redis: redisClient,
          req: req.req,
          res: req.res
        }
      }
    })

    this.apolloServer = apolloTestServer

    const app = express()

    const RedisStore = connectRedis(session)
    const redisClient = new Redis()

    this.redis = redisClient

    app.use(session({
      store: new RedisStore({
        client: redisClient,
        disableTouch: true
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 2, // 2 years
        httpOnly: true,
        sameSite: "lax",
        secure: false
      },
      name: TEST_COOKIE_NAME,
      saveUninitialized: false,
      secret: 'jnibhuvgkycfctyvgkujbhlkj',
      resave: false,
    }))

    apolloTestServer.applyMiddleware({
      app,
      cors: false
    })

    this.expressApp = app
    return
  }

  constructor() { }
}