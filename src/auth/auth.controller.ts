import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignInDto } from './dto/auth-signIn.dto';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signin')
  async signIn(@Body() authSignIn: AuthSignInDto) {
    return await this.authService.signIn(authSignIn);
  }
}
