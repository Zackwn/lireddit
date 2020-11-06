import { Resolver, Query, Ctx, Arg, Int, Mutation, UseMiddleware } from "type-graphql";
import { MyContext } from "src/types";
import { Post } from "../../entities/Post";
import { PostOptionsInput } from "./PostOptionsInput";
import { isAuth } from "../../middlewares/isAuth";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  async posts(
    @Ctx() { }: MyContext
  ): Promise<Post[]> {
    const posts = await Post.find()
    return posts
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