import { Resolver, Query, Ctx, Arg, Int, Mutation } from "type-graphql";
import { MyContext } from "src/types";
import { Post } from "../../entities/Post";

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
  async createPost(
    @Arg('title', () => String) title: string,
    @Ctx() { }: MyContext
  ): Promise<Post> {
    return Post.create({ title }).save()
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