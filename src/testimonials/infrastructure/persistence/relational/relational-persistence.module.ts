import { Module } from '@nestjs/common';
import { TestimonialRepository } from '../testimonial.repository';
import { TestimonialsRelationalRepository } from './repositories/testimonial.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestimonialEntity } from './entities/testimonial.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TestimonialEntity])],
  providers: [
    {
      provide: TestimonialRepository,
      useClass: TestimonialsRelationalRepository,
    },
  ],
  exports: [TestimonialRepository],
})
export class RelationalTestimonialPersistenceModule {}
