import { SECRET } from '../config.js';
import jwt from 'jsonwebtoken';
import bc from 'bcryptjs';

export const getSecret = (secret = SECRET) => {
    if (typeof secret !== 'string' || secret === '') {
        throw new Error('Bad Secret for token creation');
    }
    return secret;
};

export type TokenPayload = {
    id: string;
    name: string;
    role: string;
};
export const createToken = (payload: TokenPayload) => {
    return jwt.sign(payload, getSecret());
};

export const readToken = (token: string) => {
    const payload = jwt.verify(token, getSecret());
    if (typeof payload === 'string') {
        throw new Error('token not valid');
    }
    return payload;
};
export const passwordEncrypt = (password: string) => {
    return bc.hash(password, 10);
};
export const passwordComparer = (
    newPassword: string,
    encryptedPassword: string
) => {
    return bc.compare(newPassword, encryptedPassword);
};
