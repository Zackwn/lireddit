import 'reflect-metadata'
import { MikroORM } from "@mikro-orm/core"
import { __prod__, __port__, COOKIE_NAME } from "./constants"
import mikroConfig from './mikro-orm.config'
import express from 'express'
import { ApolloServer } from "apollo-server-express"
import { buildSchema } from "type-graphql"
import { HelloResolver } from "./resolvers/hello"
import { PostResolver } from './resolvers/post/PostResolver'
import { UserResolver } from './resolvers/user/UserResolver'
import redis from 'redis'
import session from 'express-session'
import connectRedis from 'connect-redis'
import cors from 'cors'
// import { User } from './entities/User'
// import { sendMail } from './services/sendEmail'

const main = async () => {
  // await sendMail('bob@bob.com', 'Hey there')
  const orm = await MikroORM.init(mikroConfig)
  // delete all users
  // await orm.em.nativeDelete(User, {})
  await orm.getMigrator().up()

  const app = express()

  const RedisStore = connectRedis(session)
  const redisClient = redis.createClient()

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
      em: orm.em,
      req,
      res
    })
  })

  apolloServer.applyMiddleware({
    app,
    cors: false
  })

  app.listen(__port__, () => {
    console.log(`app listening on localhost:${__port__}`)
  })
}

main().catch(err => {
  console.error(err)
})