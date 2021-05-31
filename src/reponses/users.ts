import 'reflect-metadata';
import { User } from '../interfaces/user';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class UserResponse {
    @Field(() => [User], {nullable: true})
    users?: User[] | null

    @Field(() => String, {nullable: true})
    token: String | null
}