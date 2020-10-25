import { ObjectType, Field } from "type-graphql"
import { Entity, Property, PrimaryKey } from "@mikro-orm/core"

@ObjectType()
@Entity()
export class Post {
  @Field()
  @PrimaryKey()
  id!: number

  @Field()
  @Property({ type: 'text' })
  title!: string

  @Field(() => String)
  @Property({ type: 'date' })
  createdAt = new Date()

  @Field(() => String)
  @Property({ type: 'date', onUpdate: () => new Date() })
  updatedAt = new Date()
}