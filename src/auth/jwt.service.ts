import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
    public generateToken(payload, secretKey, tokenLife): Promise<string>{
        
        return new Promise((resolve, reject) => {
            jwt.sign(
                payload,
                secretKey,
                {
                    algorithm: 'HS256',
                    expiresIn: tokenLife,
                },
                (error, token) => {
                    if(error) {
                        return reject(error);
                    }
                    resolve(token);
                }
            );
        });
    }

    /*
    *   ignoreExp = true when verify to create new accesstoken
    */
    public verifyToken(token, secretKey, ignoreExp = false){
        const option = ignoreExp ? {ignoreExpiration: true} : {};
        return new Promise((resolve, reject) => {
            jwt.verify(token, secretKey, option, (error, payload) => {
                if(error){
                    return reject(error);
                }
                resolve(payload);
            });
        });
    }
}
