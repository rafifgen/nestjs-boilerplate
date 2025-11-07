import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestimonialEntity } from '../entities/testimonial.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Testimonial } from '../../../../domain/testimonial';
import { TestimonialRepository } from '../../testimonial.repository';
import { TestimonialMapper } from '../mappers/testimonial.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class TestimonialsRelationalRepository implements TestimonialRepository {
  constructor(
    @InjectRepository(TestimonialEntity)
    private readonly testimonialRepository: Repository<TestimonialEntity>,
  ) {}

  async create(
    data: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Testimonial> {
    const persistenceModel = TestimonialMapper.toPersistence(
      data as Testimonial,
    );
    const newEntity = await this.testimonialRepository.save(
      this.testimonialRepository.create(persistenceModel),
    );
    return TestimonialMapper.toDomain(newEntity);
  }

  async findAllWithPagination(
    paginationOptions: IPaginationOptions,
  ): Promise<Testimonial[]> {
    const entities = await this.testimonialRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      order: {
        createdAt: 'DESC',
      },
    });

    return entities.map((entity) => TestimonialMapper.toDomain(entity));
  }

  async findById(id: Testimonial['id']): Promise<NullableType<Testimonial>> {
    const entity = await this.testimonialRepository.findOne({
      where: { id },
    });

    return entity ? TestimonialMapper.toDomain(entity) : null;
  }

  async findAllActive(): Promise<Testimonial[]> {
    const entities = await this.testimonialRepository.find({
      where: { isActive: true },
      order: {
        createdAt: 'DESC',
      },
    });

    return entities.map((entity) => TestimonialMapper.toDomain(entity));
  }

  async update(
    id: Testimonial['id'],
    payload: Partial<Testimonial>,
  ): Promise<Testimonial | null> {
    const entity = await this.testimonialRepository.findOne({
      where: { id },
    });

    if (!entity) {
      return null;
    }

    const updatedEntity = await this.testimonialRepository.save(
      this.testimonialRepository.create(
        TestimonialMapper.toPersistence({
          ...TestimonialMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return TestimonialMapper.toDomain(updatedEntity);
  }

  async remove(id: Testimonial['id']): Promise<void> {
    await this.testimonialRepository.delete(id);
  }
}
