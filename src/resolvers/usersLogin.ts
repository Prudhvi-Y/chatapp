import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { UserResponse } from "../reponses/users";
import { MyContext } from "src/types";
import * as bcrypt from "bcrypt";
import jwt, { Secret } from 'jsonwebtoken';
import { getUserId } from '../helpers/jwtUtil';


@Resolver()
export class SignupResolver {
    @Mutation(() => UserResponse)
    async userRegistration(
        @Arg('email') email: string,
        @Arg('name') name: string,
        @Arg('password') password: string,
        @Ctx() {prisma}: MyContext
    ): Promise<UserResponse | null> {

        const user = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: await bcrypt.hash(password, 10),
            },
        });
        const token = jwt.sign(user, process.env.APP_SECRET as Secret, {expiresIn: '1h'});
        if (user){
            return {
                users: [user],
                token: token,
            };
        } else {
            return {
                users: null,
                token: null,
            };
        }
    }

    @Mutation(() => UserResponse)
    async userLogin(
        @Arg('email') email: string,
        @Arg('password') password: string,
        @Ctx() {prisma}: MyContext
    ): Promise<UserResponse | null> {

        const user = await prisma.user.findFirst({
            where: {
                email: email,
            },
        });

        if (!user) {
            throw new Error('No user found for login.');
        }

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            throw new Error('Password incorrect for user login.');
        }

        const token = jwt.sign(user, process.env.APP_SECRET as Secret, {expiresIn: '1h'});
        if (user){
            return {
                users: [user],
                token: token,
            };
        } else {
            return {
                users: null,
                token: null,
            };
        }
    }

    @Query(() => UserResponse)
    async userchecktoken(
        @Ctx() {req}: MyContext
    ): Promise<UserResponse | null> {

        const user = getUserId(req);

        if (user){
            return {
                users: [user],
                token: null,
            };
        } else {
            return {
                users: null,
                token: null,
            };
        }
    }
}