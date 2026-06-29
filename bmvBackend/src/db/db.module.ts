import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],

            useFactory: (config: ConfigService) => ({
                type: 'postgres',
                host: config.get<string>('DB_HOST'),
                port: config.get<number>('DB_PORT'),
                username: config.get<string>('DB_USER'),
                password: 'postgres@123',

                // config.get<string>('DB_PASS'),
                database: config.get<string>('DB_NAME'),

                autoLoadEntities: true,
                synchronize: config.get<string>('NODE_ENV') !== 'production', // auto-sync in dev, off in prod
                logging: config.get<string>('NODE_ENV') === 'development',


            }),
        }),
    ],
})
export class DbModule { }