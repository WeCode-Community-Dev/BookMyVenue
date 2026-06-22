import { Inject } from "@nestjs/common";
import type { IVenueRepository } from "src/core/domain/venues/repositories/venue-repository.interface";
import type { IFileStorage } from "../../_shared/storage/file-storage.interface";
import { NotFoundException } from "src/core/domain/_shared/exception/notfound.exception";
import type { IVenueImageRepository } from "src/core/domain/venues/repositories/venue-image-repository.interface";
import { VenueImage } from "src/core/domain/venues/entities/venue-image.entity";
import { BusinessRuleException } from "src/core/domain/_shared/exception/business-rule.exception";

type UploadVenueImageInputDto = {
    ownerId: string,
    venueId: string,
    files: {
        fileName: string,
        buffer: Buffer
    }[]
}


export class UploadVenueImagesCommand {
    constructor(
        @Inject('IVenueRepository')
        private readonly venueRepository: IVenueRepository,
        @Inject('IVenueImageRepository')
        private readonly venueImageRepository: IVenueImageRepository,
        @Inject('IFileStorage')
        private readonly fileStorage: IFileStorage,
    ) { }

    async execute(dto: UploadVenueImageInputDto): Promise<{ message: string }> {

        const venue = await this.venueRepository.findById(dto.venueId);

        if (!venue) {
            throw new NotFoundException(
                'Venue not found',
            );
        }

        if (venue.ownerId !== dto.ownerId) throw new BusinessRuleException('invalid venue id, cannot process')

        const venueImages: VenueImage[] = []

        for (const file of dto.files) {

            const url = await this.fileStorage.upload(
                file.fileName,
                file.buffer,
            );
            venueImages.push(VenueImage.create(crypto.randomUUID(), {
                url,
                venueId: dto.venueId,
            }))

        }

        await this.venueImageRepository.create(venueImages);

        return {
            message: 'Venue images uploaded successfully'
        }
    }
}