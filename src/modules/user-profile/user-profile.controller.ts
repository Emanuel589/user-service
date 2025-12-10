import { Controller, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ForcePasswordChangeGuard } from '../auth/guards/force-password-change.guard';

@Controller('user-profile')
@UseGuards(JwtAuthGuard, ForcePasswordChangeGuard)
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userProfileService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.userProfileService.update(id, updateProfileDto);
  }
}
