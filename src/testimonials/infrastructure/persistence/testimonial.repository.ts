import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Testimonial } from '../../domain/testimonial';

export abstract class TestimonialRepository {
  abstract create(
    data: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Testimonial>;

  abstract findAllWithPagination(
    paginationOptions: IPaginationOptions,
  ): Promise<Testimonial[]>;

  abstract findById(id: Testimonial['id']): Promise<NullableType<Testimonial>>;

  abstract findAllActive(): Promise<Testimonial[]>;

  abstract update(
    id: Testimonial['id'],
    payload: DeepPartial<Testimonial>,
  ): Promise<Testimonial | null>;

  abstract remove(id: Testimonial['id']): Promise<void>;
}
