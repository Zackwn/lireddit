import { Resolver, Query, Ctx, Arg, Int, Mutation, UseMiddleware } from "type-graphql";
import { MyContext } from "src/types";
import { Post } from "../../entities/Post";
import { PostOptionsInput } from "./PostOptionsInput";
import { isAuth } from "../../middlewares/isAuth";
import { getConnection } from "typeorm";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  async posts(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null
  ): Promise<Post[]> {
    const realLimit = Math.min(50, limit)
    const queryBuilder = getConnection()
      .getRepository(Post)
      .createQueryBuilder("p")
      .orderBy('"createdAt"', 'DESC') // Postgres don't lowercase text inside double quotes
      .take(realLimit)

    if (cursor) {
      queryBuilder.where('"createdAt" < :cursor', {
        cursor: new Date(parseInt(cursor))
      })
    }

    return queryBuilder.getMany()
  }

  @Query(() => Post, { nullable: true })
  async post(
    @Arg('id', () => Int) id: number,
    @Ctx() { }: MyContext
  ): Promise<Post | undefined> {
    const post = await Post.findOne({ where: { id: id } })
    return post
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg('options', () => PostOptionsInput) options: PostOptionsInput,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    return Post.create({
      title: options.title,
      text: options.text,
      creatorId: req.session.userId,
    }).save()
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg('id', () => Int) id: number,
    @Arg('title', () => String, { nullable: true }) title: string,
    @Ctx() { }: MyContext
  ): Promise<Post | null> {
    const post = await Post.findOne({ where: { id: id } })
    if (!post) {
      return null
    }
    if (typeof title !== 'undefined') {
      await Post.update({ id: id }, { title: title })
    }
    return post
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg('id', () => Int) id: number,
    @Ctx() { }: MyContext
  ): Promise<boolean> {
    await Post.delete({ id: id })
    return true
  }
}