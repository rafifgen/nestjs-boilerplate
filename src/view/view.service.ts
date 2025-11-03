import { Injectable } from '@nestjs/common';
import path from 'path';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../config/config.type';
import { NunjucksEngine } from './engine/nunjucks.engine';
import { TemplateEngine } from './engine/template-engine';

@Injectable()
export class ViewService {
  private engine: TemplateEngine;
  private baseThemesPath: string;

  constructor(private readonly config: ConfigService<AllConfigType>) {
    // Only Nunjucks implemented for now; config allows future engines
    this.engine = new NunjucksEngine();
    this.baseThemesPath = path.join(__dirname, 'themes');
  }

  configure(theme: string) {
    const viewsPaths = [
      path.join(this.baseThemesPath, theme, 'views'),
      path.join(this.baseThemesPath, 'default', 'views'), // fallback
    ];
    this.engine.configure(viewsPaths, { noCache: true });
  }

  async render(template: string, params: Record<string, any>) {
    // template is relative path like 'pages/home.njk'
    return this.engine.render(template, params);
  }
}
