import { Controller, Get, Redirect } from '@nestjs/common';

@Controller('/')
export class AppController {
  @Get('/')
  @Redirect('/health-check', 302)
  RedirectToHealthCheck() {}

  @Get('/health-check')
  HealthCheck() {
    return 'OK';
  }
}
