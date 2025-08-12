import { SignUpHandler } from './signup.handler';
import { SignInHandler } from './sigin-handler';
import { AcceptInviteHandler } from './accept-invite.handler';
import { EmployeeInviteHandler } from './employee-invite.handler';
import { VerifyEmailHandler } from './verify-email.handler';

export const UserCommandHandlers = [
  SignUpHandler,
  SignInHandler,
  AcceptInviteHandler,
  EmployeeInviteHandler,
  VerifyEmailHandler,
];
