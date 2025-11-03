import { Module } from '@nestjs/common';
import { WebController } from './web.controller';
import { ViewModule } from '../view/view.module';

@Module({
  imports: [ViewModule],
  controllers: [WebController],
})
export class WebModule {}
