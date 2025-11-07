import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { ConfigModule } from '@nestjs/config';
import { TestimonialsModule } from '../testimonials/testimonials.module';
import { ViewModule } from '../view/view.module';

@Module({
	imports: [ConfigModule, TestimonialsModule, ViewModule],
	controllers: [HomeController],
	providers: [HomeService],
})
export class HomeModule {}
