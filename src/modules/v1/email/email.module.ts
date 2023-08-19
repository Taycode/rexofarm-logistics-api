import { Global, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Import ConfigService
import { EmailService } from './email.service';

@Global()
@Module({
	providers: [EmailService],
	imports: [
		ConfigModule, // Import ConfigModule
		MailerModule.forRootAsync({
			inject: [ConfigService], // Inject ConfigService
			useFactory: (configService: ConfigService) => ({
				transport: {
					host: configService.get('EMAIL_HOST'), // Use configService to get environment variables
					auth: {
						user: configService.get('EMAIL_USER'),
						pass: configService.get('EMAIL_PASSWORD'),
					},
				},
				defaults: {
					from: configService.get('EMAIL_USER'),
				},
				template: {
					dir: `${__dirname}templates`,
					adapter: new HandlebarsAdapter(),
					options: {
						strict: true,
					},
				},
			}),
		}),
	],
	exports: [EmailService],
})
export class EmailModule {}
