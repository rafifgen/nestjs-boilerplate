import {
	HttpStatus,
	Module,
	UnprocessableEntityException,
} from '@nestjs/common';
import { FilesLocalController } from './files.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import * as fs from 'fs';
import * as path from 'path';

import { FilesLocalService } from './files.service';

import { DocumentFilePersistenceModule } from '../../persistence/document/document-persistence.module';
import { RelationalFilePersistenceModule } from '../../persistence/relational/relational-persistence.module';
import { AllConfigType } from '../../../../config/config.type';
import { DatabaseConfig } from '../../../../database/config/database-config.type';
import databaseConfig from '../../../../database/config/database.config';

// <database-block>
const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
	.isDocumentDatabase
	? DocumentFilePersistenceModule
	: RelationalFilePersistenceModule;
// </database-block>

@Module({
	imports: [
		infrastructurePersistenceModule,
		MulterModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService<AllConfigType>) => {
				// Ensure the upload directory exists
				const uploadDir = '/tmp/files';
				if (!fs.existsSync(uploadDir)) {
					fs.mkdirSync(uploadDir, { recursive: true });
				}

				return {
					fileFilter: (request, file, callback) => {
						if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
							return callback(
								new UnprocessableEntityException({
									status: HttpStatus.UNPROCESSABLE_ENTITY,
									errors: {
										file: `cantUploadFileType`,
									},
								}),
								false,
							);
						}

						callback(null, true);
					},
					storage: diskStorage({
						destination: (req, file, callback) => {
							// Ensure directory exists for each upload
							if (!fs.existsSync(uploadDir)) {
								fs.mkdirSync(uploadDir, { recursive: true });
							}
							callback(null, uploadDir);
						},
						filename: (request, file, callback) => {
							callback(
								null,
								`${randomStringGenerator()}.${file.originalname
									.split('.')
									.pop()
									?.toLowerCase()}`,
							);
						},
					}),
					limits: {
						fileSize: configService.get('file.maxFileSize', { infer: true }),
					},
				};
			},
		}),
	],
	controllers: [FilesLocalController],
	providers: [ConfigModule, ConfigService, FilesLocalService],
	exports: [FilesLocalService],
})
export class FilesLocalModule {}
