import { Body, Controller, Param, Post, Put, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  EmployeeInviteDto,
  SignInDto,
  SignUpDto,
  VerifyEmailDto,
} from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signup(@Body() signUpDto: SignUpDto) {
    return this.usersService.signup(signUpDto);
  }

  @Post('signup/verify-email')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.usersService.verifyEmail(verifyEmailDto);
  }

  @Post('signin')
  async signin(@Body() signInDto: SignInDto) {
    return this.usersService.signIn(signInDto);
  }

  @Post('invite')
  async invite(
    @Body() employeeInviteDto: EmployeeInviteDto,
    @Query('organization') organization: string,
  ) {
    return this.usersService.sendEmployeeInvite(
      employeeInviteDto,
      organization,
    );
  }

  @Put('accept-invite/:accessCode')
  async acceptInvite(@Param('accessCode') accessCode: string) {
    return this.usersService.acceptInvite(accessCode);
  }
}
