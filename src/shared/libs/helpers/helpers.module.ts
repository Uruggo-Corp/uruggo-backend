import { Module } from '@nestjs/common';
import { HelpersService } from './helpers.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      signOptions: {
        issuer: 'https://api.uruggo.com',
        audience: 'https://uruggo.com',
      },
      verifyOptions: {
        issuer: 'https://api.uruggo.com',
        audience: 'https://uruggo.com',
      },
    }),
  ],
  providers: [HelpersService],
  exports: [HelpersService],
})
export class HelpersModule {}
