import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestimonialEntity } from '../../../../testimonials/infrastructure/persistence/relational/entities/testimonial.entity';
import { TestimonialSeedService } from './testimonial-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([TestimonialEntity])],
  providers: [TestimonialSeedService],
  exports: [TestimonialSeedService],
})
export class TestimonialSeedModule {}
