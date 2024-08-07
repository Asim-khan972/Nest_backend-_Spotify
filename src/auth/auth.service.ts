import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User } from 'src/entities/user/user.entity';
import { LoginDTO } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ArtistsService } from 'src/artists/artists.service';
import { PayloadType } from 'src/artists/types';
import * as speakeasy from 'speakeasy';
import { Enable2FAType } from './types';
import { UpdateResult } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private artistService: ArtistsService,
  ) {}
  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  /*
   *this is login function pass the data to another function UserService that return a user to it
   *
   */
  async login(
    loginDTO: LoginDTO,
  ): Promise<
    { accessToken: string } | { validate2FA: string; message: string }
  > {
    const user = await this.userService.findOne(loginDTO); // 1.
    const passwordMatched = await bcrypt.compare(
      loginDTO.password,
      user.password,
    ); // 2.
    if (passwordMatched) {
      // 3.
      delete user.password; // 4.

      const payload: PayloadType = { email: user.email, userId: user.id }; // 1
      // find if it is an artist then the add the artist id to payload
      const artist = await this.artistService.findArtist(user.id); // 2
      if (artist) {
        // 3
        payload.artistId = artist.id;
      }

      // // If user has enabled 2FA and have the secret key then
      // if (user.enable2FA && user.twoFASecret) {
      //   //1.
      //   // sends the validateToken request link
      //   // else otherwise sends the json web token in the response
      //   return {
      //     //2.
      //     validate2FA: 'http://localhost:3000/auth/validate-2fa',
      //     message:
      //       'Please send the one-time password/token from your Google Authenticator App',
      //   };
      // }
      return { accessToken: this.jwtService.sign(payload) };
    } else {
      throw new UnauthorizedException('Password does not match'); // 5.
    }
  }
  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  /**this function get user id
   * find the user from that id
   * if user have enable the 2fa than it will return that
   * but if not then it will create a key and update the key in database
   *
   */
  async enable2FA(userId: number): Promise<Enable2FAType> {
    const user = await this.userService.findById(userId); //1
    if (user.enable2FA) {
      return { secret: user.twoFASecret };
    }

    const secret = speakeasy.generateSecret();
    // console.log(secret);
    user.twoFASecret = secret.base32;
    await this.userService.updateSecretKey(user.id, user.twoFASecret); //5

    return { secret: user.twoFASecret }; //6
  }

  /**this function get userId and find him and disable his 2fa  */

  async disable2FA(userId: number): Promise<UpdateResult> {
    return this.userService.disable2FA(userId);
  }

  // validate the 2fa secret with provided token
  async validate2FAToken(
    userId: number,
    token: string,
  ): Promise<{ verified: boolean }> {
    try {
      // find the user on the based on id
      const user = await this.userService.findById(userId);

      // extract his 2FA secret

      // verify the secret with a token by calling the speakeasy verify method
      const verified = speakeasy.totp.verify({
        secret: user.twoFASecret,
        token: token,
        encoding: 'base32',
      });

      // if validated then sends the json web token in the response
      if (verified) {
        return { verified: true };
      } else {
        return { verified: false };
      }
    } catch (err) {
      throw new UnauthorizedException('Error verifying token');
    }
  }

  async validateUserByApiKey(apiKey: string): Promise<User> {
    return this.userService.findByApiKey(apiKey);
  }
}
