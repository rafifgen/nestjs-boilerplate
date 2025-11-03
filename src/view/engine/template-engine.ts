export interface RenderOptions {
  // locals/variables passed to the template
  [key: string]: any;
}

export interface TemplateEngine {
  name: string;
  extension: string; // e.g., njk/hbs
  configure(viewsPaths: string[], options?: any): void;
  render(filePath: string, context: RenderOptions): Promise<string>;
}
