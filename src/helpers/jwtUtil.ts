import jwt, { Secret } from 'jsonwebtoken';
import { Request } from "express";
import { User } from '../interfaces/user';

export function getTokenPayload(token: string):User | null {
    return jwt.verify(token, process.env.APP_SECRET as Secret) as User | null;
}

export function getUserId(req: Request):User|null {


    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.replace('Bearer ', '');
        if (!token) {
            throw new Error('No token found');
        }
        const userId = getTokenPayload(token);
        return userId;
    } else {
        throw new Error('No authHeader found');
        return null;
    }
    
}