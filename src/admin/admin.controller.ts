import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  Res,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { TestimonialsService } from '../testimonials/testimonials.service';
import { CreateTestimonialDto } from '../testimonials/dto/create-testimonial.dto';
import { UpdateTestimonialDto } from '../testimonials/dto/update-testimonial.dto';
import { ThemeService } from '../view/theme.service';
import { ViewService } from '../view/view.service';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';

@Controller('admin')
@UseGuards(AdminAuthGuard)
export class AdminController {
  constructor(
    private readonly testimonialsService: TestimonialsService,
    private readonly themeService: ThemeService,
    private readonly view: ViewService,
  ) {}

  @Get('testimonials')
  async testimonialsList(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page?: string,
  ) {
    const currentPage = parseInt(page || '1', 10);
    const limit = 10;

    const testimonials = await this.testimonialsService.findAllWithPagination({
      page: currentPage,
      limit,
    });

    const theme = this.themeService.getTheme(req);
    this.view.configure(theme);

    const html = await this.view.render('pages/admin/testimonials-list.njk', {
      title: 'Manage Testimonials',
      testimonials,
      currentPage,
      theme,
    });

    res.type('html').send(html);
  }

  @Get('testimonials/create')
  async testimonialsCreate(@Req() req: Request, @Res() res: Response) {
    const theme = this.themeService.getTheme(req);
    this.view.configure(theme);

    const html = await this.view.render('pages/admin/testimonials-form.njk', {
      title: 'Create Testimonial',
      action: 'Create',
      testimonial: null,
      theme,
    });

    res.type('html').send(html);
  }

  @Post('testimonials')
  async testimonialsStore(@Body() body: any, @Res() res: Response) {
    try {
      // Transform form data to proper types
      const createTestimonialDto: CreateTestimonialDto = {
        name: body.name,
        position: body.position,
        content: body.content,
        avatar: body.avatar || null,
        rating: parseInt(body.rating, 10),
        isActive: body.isActive === 'true' || body.isActive === true,
      };

      await this.testimonialsService.create(createTestimonialDto);
      res.redirect('/admin/testimonials');
    } catch {
      res.status(HttpStatus.BAD_REQUEST).send('Error creating testimonial');
    }
  }

  @Get('testimonials/:id/edit')
  async testimonialsEdit(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const testimonial = await this.testimonialsService.findOne(+id);

    if (!testimonial) {
      return res.status(HttpStatus.NOT_FOUND).send('Testimonial not found');
    }

    const theme = this.themeService.getTheme(req);
    this.view.configure(theme);

    const html = await this.view.render('pages/admin/testimonials-form.njk', {
      title: 'Edit Testimonial',
      action: 'Edit',
      testimonial,
      theme,
    });

    res.type('html').send(html);
  }

  @Post('testimonials/:id')
  async testimonialsUpdate(
    @Param('id') id: string,
    @Body() body: any,
    @Res() res: Response,
  ) {
    try {
      // Transform form data to proper types
      const updateTestimonialDto: UpdateTestimonialDto = {
        name: body.name,
        position: body.position,
        content: body.content,
        avatar: body.avatar || null,
        rating: body.rating ? parseInt(body.rating, 10) : undefined,
        isActive: body.isActive === 'true' || body.isActive === true,
      };

      await this.testimonialsService.update(+id, updateTestimonialDto);
      res.redirect('/admin/testimonials');
    } catch {
      res.status(HttpStatus.BAD_REQUEST).send('Error updating testimonial');
    }
  }

  @Post('testimonials/:id/delete')
  async testimonialsDelete(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.testimonialsService.remove(+id);
      res.redirect('/admin/testimonials');
    } catch {
      res.status(HttpStatus.BAD_REQUEST).send('Error deleting testimonial');
    }
  }
}
