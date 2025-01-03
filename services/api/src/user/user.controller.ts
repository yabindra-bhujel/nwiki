import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req, UnauthorizedException, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateGoogleAuthInputDto } from './dto/create-google-auth.dto';
import { Response, Request } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/google-auth')
  async createGoogleAuthUser(
    @Body() createGoogleAuthInputDto: CreateGoogleAuthInputDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = await this.userService.createGoogleAuthUser(createGoogleAuthInputDto);
    response.cookie('jwt', token, { httpOnly: true, sameSite: 'lax', path: '/' });

    return { message: 'Successful create user account' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async me(@Req() request: Request) {
    const token = request.cookies['jwt'];
    if (!token) {
      throw new UnauthorizedException();
    }
    const user = await this.userService.me(token);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
    return { message: 'Successful logout' };
  }
}

