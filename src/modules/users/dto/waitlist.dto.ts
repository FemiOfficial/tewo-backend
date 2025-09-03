import { IsNotEmpty, IsString } from 'class-validator';

export class AddUserWaitlistAccessCodeDto {
  @IsString()
  @IsNotEmpty()
  email: string;
}
