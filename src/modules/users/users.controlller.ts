import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  EmployeeInviteDto,
  SignInDto,
  SignUpDto,
  VerifyEmailDto,
} from './dto/user.dto';
import { AuthInterceptor } from '../../shared/interceptors/auth.interceptor';
import { AddUserWaitlistAccessCodeDto } from './dto/waitlist.dto';
import { InternalGuard } from '../token/guard/internal.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(InternalGuard)
  @Post('add-waitlist')
  async addUserWaitlistAccessCode(@Body() body: AddUserWaitlistAccessCodeDto) {
    return this.usersService.addUserWaitlistAccessCode(body.email);
  }

  @Post('signup')
  @UseInterceptors(AuthInterceptor)
  async signup(@Body() signUpDto: SignUpDto) {
    return this.usersService.signup(signUpDto);
  }

  @Post('signup/verify-email')
  @UseInterceptors(AuthInterceptor)
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.usersService.verifyEmail(verifyEmailDto);
  }

  @Post('signin')
  @UseInterceptors(AuthInterceptor)
  async signin(@Body() signInDto: SignInDto) {
    return this.usersService.signIn(signInDto);
  }

  @Post('invite')
  async invite(
    @Body() employeeInviteDto: EmployeeInviteDto,
    @Query('organization') organization: string,
    @Query('invitedBy') invitedBy: string,
  ) {
    return this.usersService.sendEmployeeInvite(
      employeeInviteDto,
      organization,
      invitedBy,
    );
  }

  @Put('accept-invite/:accessCode')
  async acceptInvite(@Param('accessCode') accessCode: string) {
    return this.usersService.acceptInvite(accessCode);
  }
}
