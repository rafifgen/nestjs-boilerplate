import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestimonialEntity } from '../../../../testimonials/infrastructure/persistence/relational/entities/testimonial.entity';

@Injectable()
export class TestimonialSeedService {
  constructor(
    @InjectRepository(TestimonialEntity)
    private testimonialRepository: Repository<TestimonialEntity>,
  ) {}

  async run() {
    const testimonials = [
      {
        name: 'Sarah Johnson',
        position: 'CEO at TechCorp',
        content:
          'This platform has completely transformed how we approach trading. The signals are accurate and the education resources are invaluable.',
        avatar: 'https://i.pravatar.cc/150?img=1',
        rating: 5,
        isActive: true,
      },
      {
        name: 'Michael Chen',
        position: 'Professional Trader',
        content:
          'I have been trading for 10 years and this is by far the best service I have used. The analysis is top-notch and support is always available.',
        avatar: 'https://i.pravatar.cc/150?img=13',
        rating: 5,
        isActive: true,
      },
      {
        name: 'Emily Rodriguez',
        position: 'Investment Manager',
        content:
          'The premium alerts have consistently outperformed my expectations. Great ROI and professional service all around.',
        avatar: 'https://i.pravatar.cc/150?img=5',
        rating: 5,
        isActive: true,
      },
      {
        name: 'David Thompson',
        position: 'Crypto Enthusiast',
        content:
          'As someone new to trading, the educational content helped me understand the markets better. Now I am making profitable trades!',
        avatar: 'https://i.pravatar.cc/150?img=12',
        rating: 4,
        isActive: true,
      },
      {
        name: 'Lisa Wang',
        position: 'Hedge Fund Analyst',
        content:
          'The track record speaks for itself. Consistent profits and transparent reporting. Highly recommended!',
        avatar: 'https://i.pravatar.cc/150?img=9',
        rating: 5,
        isActive: true,
      },
    ];

    for (const testimonialData of testimonials) {
      const existingTestimonial = await this.testimonialRepository.findOne({
        where: { name: testimonialData.name },
      });

      if (!existingTestimonial) {
        await this.testimonialRepository.save(
          this.testimonialRepository.create(testimonialData),
        );
      }
    }
  }
}
