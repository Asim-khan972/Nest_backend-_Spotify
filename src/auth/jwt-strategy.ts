import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { authConstant } from './auth.constant';
import { PayloadType } from 'src/artists/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    /**now as we are extending PassportStrategy and we will call it through super
     * make changes in it
     */

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 1.
      ignoreExpiration: false, // 2.
      secretOrKey: 'HAD_12X#@', // 3.
    });
  }

  /** as we know whenever someone call auth guard he will need this will calledS
   *
   * now inject this into ... auth module provider
   */
  async validate(payload: PayloadType) {
    //1.
    return {
      userId: payload.userId,
      email: payload.email,
      artistId: payload.artistId, // 2
    };
  }
}
