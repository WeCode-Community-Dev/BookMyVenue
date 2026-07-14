import { Entity } from '../../_shared/entity/entity';
import { DomainException } from '../../_shared/exception/domain.exception';

export interface VenueImageProps {
    venueId: string;
    url: string;
    createdAt?: Date;
}

export class VenueImage extends Entity<string> {
    private props: VenueImageProps;

    private constructor(
        id: string,
        props: VenueImageProps,
    ) {
        super(id);

        this.props = {
            ...props,
            createdAt: props.createdAt ?? new Date(),
        };
    }

    public static create(
        id: string,
        props: VenueImageProps,
    ): VenueImage {
        if (!props.venueId?.trim()) {
            throw new DomainException(
                'Venue ID is required',
            );
        }

        if (!props.url?.trim()) {
            throw new DomainException(
                'Image URL is required',
            );
        }

        return new VenueImage(id, props);
    }

    public static restore(
        id: string,
        props: VenueImageProps,
    ): VenueImage {
        return new VenueImage(id, props);
    }

    get venueId(): string {
        return this.props.venueId;
    }

    get url(): string {
        return this.props.url;
    }

    get createdAt(): Date {
        return this.props.createdAt!;
    }

    public updateUrl(
        url: string,
    ): void {
        if (!url?.trim()) {
            throw new DomainException(
                'Image URL is required',
            );
        }

        this.props.url = url;
    }
}