import { Field, InputType } from "type-graphql";

@InputType()
export class UserOptionsInput {
  @Field()
  username: string;

  @Field()
  password: string;

  @Field()
  email: string;
}
