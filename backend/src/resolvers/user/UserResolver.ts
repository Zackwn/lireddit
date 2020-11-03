import argon2 from "argon2";
import { sendMail } from "../../services/sendEmail";
import { MyContext } from "../../types";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { COOKIE_NAME, FORGET_PASSWORD_REDIS_PREFIX } from "../../constants";
import { User } from "../../entities/User";
import { validateUser } from "../../validators/user";
import { validateUserPassword } from '../../validators/user/validateUser'
import { UserOptionsInput } from "./UserOptionsInput";
import { v4 } from 'uuid'
import { UserResponse } from "./UserResponse";

@Resolver()
export class UserResolver {

  @Query(() => User, { nullable: true })
  async me(
    @Ctx() { req }: MyContext
  ): Promise<User | undefined> {
    const userId = req.session.userId
    if (!userId) {
      return undefined
    }
    const user = await User.findOne({ where: { id: userId } })
    return user
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UserOptionsInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const errorsArray = validateUser(options)

    const usernameTaken = await User.findOne({
      where: {
        username: options.username
      }
    })

    if (usernameTaken) {
      errorsArray.push({
        field: 'username',
        message: 'username alredy taken'
      })
    }

    const emailTaken = await User.findOne({
      where: {
        email: options.email
      }
    })

    if (emailTaken) {
      errorsArray.push({
        field: 'email',
        message: 'email alredy taken'
      })
    }

    if (errorsArray.length >= 1) {
      return { errors: errorsArray }
    }

    try {
      const hashedPassword = await argon2.hash(options.password)

      const user = await User.create({
        username: options.username,
        password: hashedPassword,
        email: options.email
      }).save()

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
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne({
      where: usernameOrEmail.includes('@')
        ? { email: usernameOrEmail }
        : { username: usernameOrEmail }
    })
    if (!user) {
      return {
        errors: [{
          field: 'usernameOrEmail',
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
    @Ctx() { }: MyContext
  ) {
    const user = await User.find()
    return user
  }

  @Mutation(() => String)
  async deleteUser(
    @Ctx() { }: MyContext
  ) {
    await User.delete({})
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

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { redis }: MyContext
  ) {
    const user = await User.findOne({ where: { email } })
    if (!user) {
      // the email is not in db
      return true
    }

    const token = v4()

    await redis.set(
      `${FORGET_PASSWORD_REDIS_PREFIX}${token}`,
      user.id,
      'ex',
      1000 * 60 * 60 // one hour
    )

    await sendMail(
      email,
      `<a href="http://localhost:3000/change-password/${token}/">Reset password</a>`
    )

    return true
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() { redis, req }: MyContext
  ): Promise<UserResponse> {
    const errorsArray = validateUserPassword(newPassword, 'newPassword')
    if (errorsArray.length >= 1) {
      return { errors: errorsArray }
    }

    const UserRedisKey = `${FORGET_PASSWORD_REDIS_PREFIX}${token}`

    const userId = await redis.get(UserRedisKey)

    if (!userId) {
      return {
        errors: [{
          field: 'token',
          message: 'token expired'
        }]
      }
    }

    const intUserId = parseInt(userId)
    const user = await User.findOne({ where: { id: intUserId } })

    if (!user) {
      await redis.del(UserRedisKey)
      return {
        errors: [{
          field: 'token',
          message: 'user no longer exists'
        }]
      }
    }

    const hashedNewPassword = await argon2.hash(newPassword)
    User.update({ id: intUserId }, { password: hashedNewPassword })

    // remove token from redis (invalidate) 
    await redis.del(UserRedisKey)

    // log in user after change password
    req.session.userId = user.id

    return { user }
  }
}