import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/*
 * so this
 */

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {}
