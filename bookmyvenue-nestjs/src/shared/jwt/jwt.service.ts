import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { JwtPayload } from './types/jwt-payload.type';

@Injectable()
export class JwtTokenService {
    constructor(private readonly jwtService: NestJwtService) { }

    async generateAccessToken(payload: JwtPayload) {
        return this.jwtService.signAsync(payload);
    }

    async verifyAccessToken(token: string) {
        return this.jwtService.verifyAsync<JwtPayload>(token);
    }
}