import { Injectable } from '@nestjs/common';
import type { IVenueImageRepository } from 'src/core/domain/venues/repositories/venue-image-repository.interface';
import { PrismaService } from '../database/prisma/prisma.service';
import { VenueImage } from 'src/core/domain/venues/entities/venue-image.entity';



@Injectable()
export class PrismaVenueImageRepository implements IVenueImageRepository {

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async create(
        images: VenueImage[],
    ): Promise<void> {

        if (images.length === 0) {
            return;
        }

        await this.prisma.venue_images.createMany({
            data: images.map(image => ({
                id: image.id,
                venue_id: image.venueId,
                image_url: image.url,
                created_at: image.createdAt,
            })),
        });
    }

    async delete(
        id: string,
    ): Promise<void> {

        await this.prisma.venue_images.delete({
            where: { id },
        });
    }

    async findByVenueId(
        venueId: string,
    ): Promise<VenueImage[]> {

        const images =
            await this.prisma.venue_images.findMany({
                where: { venue_id: venueId },
                orderBy: {
                    created_at: 'asc',
                },
            });

        return images.map(image =>
            VenueImage.restore(
                image.id,
                {
                    venueId: image.venue_id,
                    url: image.image_url,
                    createdAt: image.created_at,
                },
            ),
        );
    }
}