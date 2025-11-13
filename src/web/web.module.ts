import { Module } from '@nestjs/common';
import { WebController } from './web.controller';
import { ViewModule } from '../view/view.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ViewModule, AuthModule],
  controllers: [WebController],
})
export class WebModule {}
