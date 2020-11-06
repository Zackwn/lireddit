import { Field, InputType } from "type-graphql";

@InputType()
export class PostOptionsInput {
  @Field()
  title: string

  @Field()
  text: string
}