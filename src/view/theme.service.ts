import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../config/config.type';

@Injectable()
export class ThemeService {
  constructor(private readonly config: ConfigService<AllConfigType>) {}

  getTheme(req?: Request): string {
    const defaultTheme =
      this.config.get('view.defaultTheme', { infer: true }) || 'default';
    if (!req) return defaultTheme;

    const headerName =
      this.config.get('view.themeHeader', { infer: true }) || 'x-theme';
    const queryKey =
      this.config.get('view.themeQueryKey', { infer: true }) || 'theme';

    const headerTheme =
      (req.headers[headerName] as string) ||
      (req.headers[headerName.toLowerCase()] as string);
    const queryTheme = (req.query?.[queryKey] as string) || undefined;

    return (queryTheme || headerTheme || '').toString() || defaultTheme;
  }
}
