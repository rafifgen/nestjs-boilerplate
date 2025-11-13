import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { ViewModule } from '../view/view.module';
import { TestimonialsModule } from '../testimonials/testimonials.module';
import { AuthModule } from '../auth/auth.module';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';

@Module({
  imports: [ViewModule, TestimonialsModule, AuthModule],
  controllers: [AdminController],
  providers: [AdminAuthGuard],
})
export class AdminModule {}
