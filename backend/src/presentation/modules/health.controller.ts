import {
    Controller,
    Get,
    HttpStatus,
    Inject,
    Injectable,
    VERSION_NEUTRAL,
} from '@nestjs/common';
import type { ILogger } from 'src/core/application/_shared/logger/ILogger';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';

@Controller({
    path: 'health',
    version: VERSION_NEUTRAL,
})
@Injectable()
export class HealthController {

    constructor(
        private readonly prisma: PrismaService,
        @Inject('ILogger') private readonly logger: ILogger
    ) { }

    @Get()
    health() {
        return {
            statusCode: HttpStatus.OK,
            status: 'ok',
            service: 'venue-booking-api',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        };
    }

    @Get('live')
    liveness() {
        return {
            statusCode: HttpStatus.OK,
            status: 'alive',
            timestamp: new Date().toISOString(),
        };
    }

    @Get('ready')
    async readiness() {
        // TODO:
        // - Check database connection
        // - Check Redis
        // - Check RabbitMQ/Kafka
        // Throw ServiceUnavailableException if any dependency is unavailable.
        let databaseUP = false

        try {
            databaseUP = !!(await this.prisma.$queryRaw`select 1 `)
        } catch (error) {
            // @ts-ignore
            this.logger.error('Database connection error ,', error?.stack, error)
        }

        return {
            statusCode: HttpStatus.OK,
            status: 'ready',
            timestamp: new Date().toISOString(),
            checks: {
                database: databaseUP ? 'up' : 'down',
            },
        };
    }
}