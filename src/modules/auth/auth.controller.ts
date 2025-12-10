import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  SetMetadata,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

export interface AuthenticatedUser {
  id: string;
  userName: string;
  email: string;
  mustChangePassword: boolean;
}

export const AllowPasswordChange = () =>
  SetMetadata('allowPasswordChange', true);

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  //@CurrentUser() user: AuthenticatedUser, otra opcion
  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @AllowPasswordChange()
  async changePassword(
    @Request() req: Request & { user: AuthenticatedUser },
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(req.user.id, changePasswordDto);
  }
}
