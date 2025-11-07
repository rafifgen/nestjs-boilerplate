import { Module } from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';
import { RelationalTestimonialPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import databaseConfig from '../database/config/database.config';
import { DatabaseConfig } from '../database/config/database-config.type';

const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? RelationalTestimonialPersistenceModule // You can create DocumentTestimonialPersistenceModule later if needed
  : RelationalTestimonialPersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule],
  providers: [TestimonialsService],
  exports: [TestimonialsService, infrastructurePersistenceModule],
})
export class TestimonialsModule {}
