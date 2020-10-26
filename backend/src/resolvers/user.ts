import argon2 from "argon2";
import { MyContext } from "src/types";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { COOKIE_NAME } from "../constants";
import { User } from "../entities/User";
import { validateRegister } from "../validators/user/validateRegister";
// import { EntityManager } from '@mikro-orm/postgresql'

@InputType()
export class UserOptionsInput {
  @Field()
  username: string

  @Field()
  password: string

  @Field()
  email: string
}

@ObjectType()
export class FieldError {
  @Field()
  field: string

  @Field()
  message: string
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => User, { nullable: true })
  user?: User
}

@Resolver()
export class UserResolver {

  @Query(() => User, { nullable: true })
  async me(
    @Ctx() { req, em }: MyContext
  ) {
    const userId = req.session.userId
    if (!userId) {
      return null
    }
    const user = await em.findOne(User, { id: userId })
    return user
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UserOptionsInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const errors = validateRegister(options)

    const usernameTaken = await em.findOne(User, { username: options.username })

    if (usernameTaken) {
      errors.push({
        field: 'username',
        message: 'username alredy taken'
      })
    }

    if (errors.length >= 1) {
      return { errors }
    }

    try {
      /*
        Other way to save the user in the database:
          let user: User
          const result = await (em as EntityManager)
            .createQueryBuilder(User)
            .getKnexQuery()
            .insert({
              username: options.username,
              password: hashedPassword,
              updated_at: new Date(),
              created_at: new Date()
            }).returning('*')
          user = result[0]
      */

      const hashedPassword = await argon2.hash(options.password)

      const user = em.create(User, {
        username: options.username,
        password: hashedPassword,
        email: options.email
      })

      await em.persistAndFlush(user)

      // store user id session
      // this will set a cookie on the user
      // keep them logged in
      req.session.userId = user.id

      return { user }
    } catch (error) {
      console.log(error)
      return {}
    }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User,
      usernameOrEmail.includes('@')
        ? { email: usernameOrEmail }
        : { username: usernameOrEmail }
    )
    if (!user) {
      return {
        errors: [{
          field: 'username',
          message: "that username doesn't exist"
        }]
      }
    }
    const validPassword = await argon2.verify(user.password, password)
    if (!validPassword) {
      return {
        errors: [{
          field: 'password',
          message: 'incorrect password'
        }]
      }
    }

    req.session.userId = user.id

    return {
      user
    }
  }

  @Query(() => [User])
  async user(
    @Ctx() { em }: MyContext
  ) {
    const user = await em.find(User, {})
    return user
  }

  @Mutation(() => String)
  async deleteUser(
    @Ctx() { em }: MyContext
  ) {
    await em.nativeDelete(User, {})
    return 'ok'
  }

  @Mutation(() => Boolean)
  async logout(
    @Ctx() { req, res }: MyContext
  ) {
    return new Promise(resolve => {
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME)
        if (err) {
          console.log(err)
          resolve(false)
          return
        }
        resolve(true)
      })
    })
  }
}