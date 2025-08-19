declare global {
  namespace Express {
    interface Request {
      organization: TokenPayload['organization'];
      user: TokenPayload['user'];
    }
  }
}
