import { Global, Module } from '@nestjs/common';
import { ThemeService } from './theme.service';
import { ViewService } from './view.service';

@Global()
@Module({
  providers: [ThemeService, ViewService],
  exports: [ThemeService, ViewService],
})
export class ViewModule {}
