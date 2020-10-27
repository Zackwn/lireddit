import { Resolver, Query, Ctx, Arg, Int, Mutation } from "type-graphql";
import { MyContext } from "src/types";
import { Post } from "../../entities/Post";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  async posts(
    @Ctx() { em }: MyContext
  ): Promise<Post[]> {
    const posts = await em.find(Post, {})
    return posts
  }

  @Query(() => Post, { nullable: true })
  async post(
    @Arg('id', () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    const post = await em.findOne(Post, { id })
    return post
  }

  @Mutation(() => Post)
  async createPost(
    @Arg('title', () => String) title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post> {
    const post = em.create(Post, { title })
    await em.persistAndFlush(post)
    return post
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg('id', () => Int) id: number,
    @Arg('title', () => String, { nullable: true }) title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    const post = await em.findOne(Post, { id })
    if (!post) {
      return null
    }
    if (typeof title !== 'undefined') {
      post.title = title
      await em.persistAndFlush(post)
    }
    return post
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg('id', () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<boolean> {
    const post = await em.findOne(Post, { id })
    if (!post) {
      return false
    }
    await em.nativeDelete(Post, { id })
    return true
  }
}