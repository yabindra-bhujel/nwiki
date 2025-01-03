import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateGoogleAuthInputDto } from './dto/create-google-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { EntityManager, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) 
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly entityManager: EntityManager,
  ) {}

 async createGoogleAuthUser(createGoogleAuthInputDto: CreateGoogleAuthInputDto) {
    const JwtPayload = this.jwtService.decode(createGoogleAuthInputDto.credentialResponse.credential);
 
    if (!JwtPayload.email) {
      throw new BadRequestException('Invalid Google Auth Response');
    }

    const existingUser = 
    await this.userRepository.findOne({ where: { email: JwtPayload.email } });
        if (existingUser) {
        existingUser.lastLogin = new Date();
        const jwtToken = await this.generateJwtToken(existingUser);
        return jwtToken;
      }

   const newUser = new User({
        email: JwtPayload.email,
        fullName: JwtPayload.name,
        image: JwtPayload.picture,
        role: 'user',
        isActive: true,
        isVerified: true,
        lastLogin: new Date(),
        createdAt: new Date()
      }
   )
    this.entityManager.save(newUser);

    const jwtToken = await this.generateJwtToken(newUser);
    return jwtToken;
}

  async me(token: string): Promise<any> {
    const email = this.jwtService.decode(token).email;
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    delete user.password;
    delete user.authProvider
    delete user.isActive
    delete user.isVerified
    delete user.createdAt
    delete user.lastLogin
    return user;
  }

  async generateJwtToken(user: User): Promise<string> {
  const payload = { email: user.email, sub: user.id };
  const token = await this.jwtService.signAsync(payload);
  return token;
  }

}
