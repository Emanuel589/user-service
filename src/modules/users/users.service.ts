import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UserProfile } from '../user-profile/entities/user-profile.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private readonly profileRepository: Repository<UserProfile>,
    private readonly configService: ConfigService,
  ) {}

  private generateDefaultPassword(): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  async create(
    createUserDto: CreateUserDto,
  ): Promise<{ user: User; defaultPassword: string }> {
    const existingUser = await this.userRepository.findOne({
      where: [
        { email: createUserDto.email },
        { userName: createUserDto.userName },
      ],
    });

    if (existingUser) {
      throw new ConflictException('Email or username already exists');
    }

    const defaultPassword = this.generateDefaultPassword();
    const saltRounds = Number(
      this.configService.get<number>('BCRYPT_ROUNDS', 10),
    );
    const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);

    const userProfile = this.profileRepository.create({
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      gender: createUserDto.gender,
    });

    const user = this.userRepository.create({
      email: createUserDto.email,
      userName: createUserDto.userName,
      password: hashedPassword,
      mustChangePassword: true,
      userProfile,
    });

    await this.userRepository.save(user);

    return { user, defaultPassword };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profile'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByUsername(userName: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { userName },
      relations: ['profile'],
    });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['profile'],
    });
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const saltRounds = this.configService.get<number>('BCRYPT_ROUNDS', 10);
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await this.userRepository.update(userId, {
      password: hashedPassword,
      mustChangePassword: false,
      lastPasswordChange: new Date(),
    });
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }
}
