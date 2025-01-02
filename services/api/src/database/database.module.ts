import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: (ConfigService: ConfigService) => ({
                type: 'mysql',
                host: ConfigService.getOrThrow('MYSQL_HOST'),
                port: ConfigService.getOrThrow('MYSQL_PORT'),
                database: ConfigService.getOrThrow('MYSQL_DATABASE'),
                username: ConfigService.getOrThrow('MYSQL_USERNAME'),
                password: ConfigService.getOrThrow('MYSQL_PASSWORD'),
                autoLoadEntities: true,
                synchronize: true,
            }),
            inject: [ConfigService],
        })
    ]
})
export class DatabaseModule {}
