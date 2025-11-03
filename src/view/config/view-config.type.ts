export type ViewEngineType = 'nunjucks' | 'handlebars';

export interface ViewConfig {
  engine: ViewEngineType;
  defaultTheme: string;
  themeHeader?: string; // header name to switch theme, default: x-theme
  themeQueryKey?: string; // query key to switch theme, default: theme
}
