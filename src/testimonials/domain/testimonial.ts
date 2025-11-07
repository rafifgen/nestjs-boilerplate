import { ApiProperty } from '@nestjs/swagger';

export class Testimonial {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    type: String,
    example: 'CEO at Example Corp',
  })
  position: string;

  @ApiProperty({
    type: String,
    example: 'This product has transformed our business!',
  })
  content: string;

  @ApiProperty({
    type: String,
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  avatar?: string | null;

  @ApiProperty({
    type: Number,
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  rating: number;

  @ApiProperty({
    type: Boolean,
    example: true,
  })
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
