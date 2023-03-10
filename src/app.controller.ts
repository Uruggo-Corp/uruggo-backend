import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Root')
export class AppController {
  @Get()
  getHello() {
    return { msg: 'Welcome to the Cooversa API' };
  }
}
