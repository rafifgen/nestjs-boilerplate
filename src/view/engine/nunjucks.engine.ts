import nunjucks, { Environment, FileSystemLoader } from 'nunjucks';
import { TemplateEngine, RenderOptions } from './template-engine';

export class NunjucksEngine implements TemplateEngine {
  name = 'nunjucks';
  extension = 'njk';
  private env?: Environment;

  configure(viewsPaths: string[], options?: any): void {
    const loader = new FileSystemLoader(viewsPaths, {
      noCache: options?.noCache ?? true,
      watch: options?.watch ?? false,
    });
    this.env = new nunjucks.Environment(loader, {
      autoescape: options?.autoescape ?? true,
      throwOnUndefined: options?.throwOnUndefined ?? false,
      trimBlocks: true,
      lstripBlocks: true,
    });

    // Register simple helper for region placeholders (areas)
    this.env.addExtension('region', {
      tags: ['region'],
      parse: function (parser: any, nodes: any) {
        const tok = parser.nextToken();
        const args = parser.parseSignature(true, true);
        parser.advanceAfterBlockEnd(tok.value);

        const body = parser.parseUntilBlocks('endregion');
        parser.advanceAfterBlockEnd();

        return new nodes.CallExtension(this, 'run', args, [body]);
      },
      run: function (
        this: any,
        context: any,
        name: string,
        body: () => string,
      ) {
        const regions = (context.ctx.__regions = context.ctx.__regions || {});
        if (!regions[name]) {
          regions[name] = body();
        }
        return '';
      },
    } as any);

    // Tag to render a previously captured region
    this.env.addExtension('renderregion', {
      tags: ['renderregion'],
      parse: function (parser: any, nodes: any) {
        const tok = parser.nextToken();
        const args = parser.parseSignature(true, true);
        parser.advanceAfterBlockEnd(tok.value);
        return new nodes.CallExtension(this, 'run', args);
      },
      run: function (this: any, context: any, name: string, fallback?: string) {
        const regions = context.ctx.__regions || {};
        return new nunjucks.runtime.SafeString(regions[name] || fallback || '');
      },
    } as any);
  }

  async render(filePath: string, context: RenderOptions): Promise<string> {
    if (!this.env) throw new Error('Nunjucks is not configured');
    return new Promise<string>((resolve, reject) => {
      this.env!.render(filePath, context, (err, res) => {
        if (err) return reject(err);
        resolve(res);
      });
    });
  }
}
