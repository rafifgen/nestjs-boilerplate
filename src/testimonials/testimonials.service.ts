import { Injectable } from '@nestjs/common';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { TestimonialRepository } from './infrastructure/persistence/testimonial.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';

@Injectable()
export class TestimonialsService {
  constructor(private readonly testimonialRepository: TestimonialRepository) {}

  create(createTestimonialDto: CreateTestimonialDto) {
    return this.testimonialRepository.create({
      ...createTestimonialDto,
      isActive: createTestimonialDto.isActive ?? true,
    });
  }

  findAllWithPagination(paginationOptions: IPaginationOptions) {
    return this.testimonialRepository.findAllWithPagination(paginationOptions);
  }

  findAllActive() {
    return this.testimonialRepository.findAllActive();
  }

  findOne(id: number) {
    return this.testimonialRepository.findById(id);
  }

  update(id: number, updateTestimonialDto: UpdateTestimonialDto) {
    return this.testimonialRepository.update(id, updateTestimonialDto);
  }

  remove(id: number) {
    return this.testimonialRepository.remove(id);
  }
}
