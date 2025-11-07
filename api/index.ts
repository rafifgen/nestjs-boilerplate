import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import express from 'express';
import { ValidationPipe, VersioningType, ClassSerializerInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { Reflector } from '@nestjs/core';
import { AllConfigType } from '../src/config/config.type';
import { ResolvePromisesInterceptor } from '../src/utils/serializer.interceptor';
import validationOptions from '../src/utils/validation-options';
import path from 'path';

const server = express();

let app: any;

async function createNestApp(): Promise<any> {
  if (!app) {
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(server),
      {
        cors: true,
      }
    );

    useContainer(nestApp.select(AppModule), { fallbackOnErrors: true });

    // Static assets configuration for Vercel
    nestApp.useStaticAssets(path.join(__dirname, '..', 'public'));
    nestApp.useStaticAssets(path.join(__dirname, '..', 'files', 'public', 'assets'), {
      prefix: '/assets',
    });
    nestApp.useStaticAssets(path.join(__dirname, '..', 'files', 'public', 'js'), {
      prefix: '/js',
    });

    const configService = nestApp.get(ConfigService<AllConfigType>);

    nestApp.enableShutdownHooks();
    nestApp.setGlobalPrefix(
      configService.getOrThrow('app.apiPrefix', { infer: true }),
      {
        exclude: ['/', '/pricing'],
      },
    );

    nestApp.enableVersioning({
      type: VersioningType.URI,
    });

    nestApp.useGlobalPipes(new ValidationPipe(validationOptions));
    nestApp.useGlobalInterceptors(
      new ResolvePromisesInterceptor(),
      new ClassSerializerInterceptor(nestApp.get(Reflector)),
    );

    // Swagger configuration
    const options = new DocumentBuilder()
      .setTitle('API')
      .setDescription('API docs')
      .setVersion('1.0')
      .addBearerAuth()
      .addGlobalParameters({
        in: 'header',
        required: false,
        name: process.env.APP_HEADER_LANGUAGE || 'x-custom-lang',
        schema: {
          example: 'en',
        },
      })
      .build();

    const document = SwaggerModule.createDocument(nestApp, options);
    SwaggerModule.setup('docs', nestApp, document);

    await nestApp.init();
    app = nestApp;
  }
  return app.getHttpAdapter().getInstance();
}

export default async (req: any, res: any) => {
  const serverInstance = await createNestApp();
  return serverInstance(req, res);
};
