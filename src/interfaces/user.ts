import { Field, ObjectType, ID } from 'type-graphql';

@ObjectType()
export class User {
    @Field(() => ID)
    id: number;

    @Field()
    email: string;

    @Field()
    name: string;

    password: string;
}