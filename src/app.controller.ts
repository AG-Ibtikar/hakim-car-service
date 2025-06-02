import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { Res } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  health(@Res() res: Response) {
    return res.status(200).json({ status: 'ok' });
  }
}
