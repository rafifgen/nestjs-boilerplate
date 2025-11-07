import { Testimonial } from '../../../../domain/testimonial';
import { TestimonialEntity } from '../entities/testimonial.entity';

export class TestimonialMapper {
  static toDomain(raw: TestimonialEntity): Testimonial {
    const domainEntity = new Testimonial();
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;
    domainEntity.position = raw.position;
    domainEntity.content = raw.content;
    domainEntity.avatar = raw.avatar;
    domainEntity.rating = raw.rating;
    domainEntity.isActive = raw.isActive;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Testimonial): TestimonialEntity {
    const persistenceEntity = new TestimonialEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.name = domainEntity.name;
    persistenceEntity.position = domainEntity.position;
    persistenceEntity.content = domainEntity.content;
    persistenceEntity.avatar = domainEntity.avatar ?? null;
    persistenceEntity.rating = domainEntity.rating;
    persistenceEntity.isActive = domainEntity.isActive;

    return persistenceEntity;
  }
}
