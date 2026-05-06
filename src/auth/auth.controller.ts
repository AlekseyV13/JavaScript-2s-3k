import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Реєстрація нового користувача' })
  @ApiResponse({ status: 201, description: 'Користувача успішно зареєстровано' })
  @ApiResponse({ status: 400, description: 'Помилка валідації' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Логін та отримання токена' })
  @ApiResponse({ status: 200, description: 'Успішний вхід, повертає JWT токен' })
  @ApiResponse({ status: 401, description: 'Невірний email або пароль' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}