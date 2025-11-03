import { registerAs } from '@nestjs/config';
import { ViewConfig } from './view-config.type';

export default registerAs(
  'view',
  (): ViewConfig => ({
    engine: (process.env.VIEW_ENGINE as any) || 'nunjucks',
    defaultTheme: process.env.VIEW_DEFAULT_THEME || 'default',
    themeHeader: process.env.VIEW_THEME_HEADER || 'x-theme',
    themeQueryKey: process.env.VIEW_THEME_QUERY || 'theme',
  }),
);
