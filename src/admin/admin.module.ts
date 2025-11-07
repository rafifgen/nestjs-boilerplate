import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { ViewModule } from '../view/view.module';
import { TestimonialsModule } from '../testimonials/testimonials.module';

@Module({
  imports: [ViewModule, TestimonialsModule],
  controllers: [AdminController],
})
export class AdminModule {}
