import { ApiProperty } from "@nestjs/swagger"


export class SearchPaginationDto {
    @ApiProperty()
    limit: number = 10

    @ApiProperty()
    offset: number = 0

    @ApiProperty()
    search?: string

    @ApiProperty()
    city?: string

    @ApiProperty()
    venueType?: string

    @ApiProperty()
    capacity?: number

}