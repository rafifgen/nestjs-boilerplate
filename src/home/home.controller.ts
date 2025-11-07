import { Controller, Get, Res, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';

import { HomeService } from './home.service';
import { ViewService } from '../view/view.service';
import { ThemeService } from '../view/theme.service';
import { TestimonialsService } from '../testimonials/testimonials.service';

@ApiTags('Home')
@Controller()
export class HomeController {
	constructor(
		private service: HomeService,
		private viewService: ViewService,
		private themeService: ThemeService,
		private testimonialsService: TestimonialsService,
	) {}

	private getCompanyData() {
		return {
			companyName: 'Data Trader Premium',
			tagline: 'Profit from Markets with Pro Traders',
			currentYear: new Date().getFullYear().toString(),
			subscriberCount: '770k+',
			ctaText: 'Join Now',
		};
	}

	private getHomePageData() {
		return {
			heroTitle: 'Profit from Markets<br>with Pro Traders',
			heroSubtitle: 'Get Trade Alerts, Daily Analysis, and Educational Guides.',
			heroDescription:
				'Direct access to Expert traders with a proven track record ↗',
		};
	}

	private getPricingPageData() {
		return {
			pricingHeroTitle:
				'You\'ve seen the results.<br>Now it\'s <span class="text-green-500">your</span> turn',
			pricingHeroSubtitle:
				'Join thousands of successful traders who trust our signals',
		};
	}

	@Get()
	async home(@Req() req: Request, @Res() res: Response) {
		const data = await this.service.appInfo();
		const theme = this.themeService.getTheme(req);

		// Get active testimonials for display
		const testimonials = await this.testimonialsService.findAllActive();

		this.viewService.configure(theme);

		const html = await this.viewService.render('pages/home.njk', {
			title: 'Data Trader Premium',
			message: 'Welcome to Data Trader Premium',
			testimonials,
			...this.getCompanyData(),
			...this.getHomePageData(),
			...data,
		});

		res.send(html);
	}

	@Get('/pricing')
	async pricing(@Req() req: Request, @Res() res: Response) {
		const data = await this.service.appInfo();
		const theme = this.themeService.getTheme(req);

		this.viewService.configure(theme);

		const html = await this.viewService.render('pages/pricing.njk', {
			title: 'Pricing - Data Trader Premium',
			message: 'Choose your plan',
			...this.getCompanyData(),
			...this.getPricingPageData(),
			...data,
		});

		res.send(html);
	}

	@Get('/api/info')
	appInfo() {
		return this.service.appInfo();
	}
}
