import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  Body,
  UnprocessableEntityException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ThemeService } from '../view/theme.service';
import { ViewService } from '../view/view.service';
import { AuthService } from '../auth/auth.service';

@Controller('web')
export class WebController {
  constructor(
    private readonly themeService: ThemeService,
    private readonly view: ViewService,
    private readonly authService: AuthService,
  ) {}

  @Get('home')
  async home(@Req() req: Request, @Res() res: Response) {
    const theme = this.themeService.getTheme(req);
    this.view.configure(theme);
    const navLinks = [
      { href: '#features', label: 'Features' },
      { href: '#track-record', label: 'Track Record' },
      { href: '#pricing', label: 'Pricing' },
      { href: '#testimonials', label: 'Testimonials' },
      { href: '#faq', label: 'FAQ' },
    ];

    const html = await this.view.render('pages/home.njk', {
      title: 'Home Page',
      message:
        'Hello from NestJS Templating with Layouts/Partials/Regions/Theme',
      // Example regions: header-banner, sidebar
      __regions: {
        'header-banner': 'Welcome Banner from Controller',
      },
      // additional template variables useful across pages
      navLinks,
      currentYear: new Date().getFullYear(),
      meta: {
        description: 'Premium trade alerts, analysis and education for traders',
        keywords: 'trading, signals, crypto, forex, stocks',
      },
      user: null, // populate when you implement auth
      theme,
    });
    res.type('html').send(html);
  }

  @Get('login')
  async showLoginPage(@Req() req: Request, @Res() res: Response) {
    const theme = this.themeService.getTheme(req);
    this.view.configure(theme);

    const html = await this.view.render('pages/auth/login.njk', {
      title: 'Login',
      theme,
    });
    res.type('html').send(html);
  }

  @Post('login')
  async login(
    @Body() body: any,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const theme = this.themeService.getTheme(req);
    this.view.configure(theme);

    try {
      const email = body.email || '';
      const password = body.password || '';

      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const loginResponse = await this.authService.validateLogin({
        email,
        password,
      });

      // Set token in Set-Cookie header
      const expiresDate = new Date(Date.now() + loginResponse.tokenExpires);
      res.setHeader('Set-Cookie', [
        `authToken=${loginResponse.token}; Path=/; HttpOnly; SameSite=Strict; Expires=${expiresDate.toUTCString()}`,
        `refreshToken=${loginResponse.refreshToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${
          7 * 24 * 60 * 60
        }`,
      ]);

      // Redirect to admin testimonials page
      res.redirect('/admin/testimonials');
    } catch (error) {
      const errorMessage =
        error.response?.errors?.email ||
        error.response?.errors?.password ||
        error.response?.message ||
        error.message ||
        'Invalid email or password. Please try again.';

      const html = await this.view.render('pages/auth/login.njk', {
        title: 'Login',
        theme,
        error: errorMessage,
      });
      res.type('html').status(HttpStatus.UNPROCESSABLE_ENTITY).send(html);
    }
  }

  @Get('register')
  async showRegisterPage(@Req() req: Request, @Res() res: Response) {
    const theme = this.themeService.getTheme(req);
    this.view.configure(theme);

    const html = await this.view.render('pages/auth/register.njk', {
      title: 'Register',
      theme,
    });
    res.type('html').send(html);
  }

  @Post('register')
  async register(
    @Body()
    body: any,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const theme = this.themeService.getTheme(req);
    this.view.configure(theme);

    try {
      const { email, password, passwordConfirm, firstName, lastName } = body;

      // Validate required fields
      if (!email || !password || !passwordConfirm || !firstName || !lastName) {
        throw new Error('All fields are required');
      }

      // Validate passwords match
      if (password !== passwordConfirm) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            passwordConfirm: 'Passwords do not match',
          },
        });
      }

      // Validate password length
      if (password.length < 8) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            password: 'Password must be at least 8 characters',
          },
        });
      }

      await this.authService.register({
        email,
        password,
        firstName,
        lastName,
      });

      // Redirect to login with success message
      res.redirect('/web/login?registered=true');
    } catch (error) {
      const html = await this.view.render('pages/auth/register.njk', {
        title: 'Register',
        theme,
        error:
          error.response?.message ||
          error.message ||
          'Registration failed. Please try again.',
      });
      res.type('html').status(HttpStatus.UNPROCESSABLE_ENTITY).send(html);
    }
  }

  @Get('logout')
  logout(@Req() req: Request, @Res() res: Response): void {
    res.setHeader('Set-Cookie', [
      'authToken=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0',
      'refreshToken=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0',
    ]);
    res.redirect('/web/home');
  }
}
