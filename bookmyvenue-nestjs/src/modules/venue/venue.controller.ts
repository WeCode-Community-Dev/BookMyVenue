import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Req,
    UploadedFile,
    UseInterceptors,
    BadRequestException,
    InternalServerErrorException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role } from '@prisma/client';
import { AuthenticatedRequest } from '../auth/types/authenticated-request.type';
import { Public } from '../../shared/decorators/public.decorator';
import { Roles } from '../../shared/decorators/roles.decorator';
import { CreateVenueDto } from './dto/create-venue.dto';
import { RejectVenueDto } from './dto/reject-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { VenueService } from './venue.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@ApiTags('Venues')
@Controller('venues')
export class VenueController {
    constructor(
        private readonly venueService: VenueService,
        private readonly cloudinaryService: CloudinaryService,
    ) { }

    @ApiBearerAuth()
    @Roles(Role.OWNER)
    @Post('upload')
    @UseInterceptors(FileInterceptor('image'))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Upload a venue image to Cloudinary' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                image: { type: 'string', format: 'binary' },
            },
        },
    })
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No image file provided.');
        }

        try {
            const secureUrl = await this.cloudinaryService.uploadImage(file);
            return {
                success: true,
                imageUrl: secureUrl,
            };
        }  catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new InternalServerErrorException(`Cloudinary Upload Failure: ${errorMessage}`);
}
    }

    @ApiBearerAuth()
    @Roles(Role.OWNER)
    @Post()
    @ApiOperation({ summary: 'Create venue as owner' })
    async create(@Body() dto: CreateVenueDto, @Req() req: AuthenticatedRequest) {
        return {
            success: true,
            message: 'Venue created successfully and sent for admin approval.',
            data: await this.venueService.create(dto, req.user.sub),
        };
    }

    @Public()
    @Get()
    @ApiOperation({ summary: 'Get public venues' })
    async findPublic() {
        return {
            success: true,
            data: await this.venueService.findPublic(),
        };
    }

    @ApiBearerAuth()
    @Roles(Role.OWNER)
    @Get('me')
    @ApiOperation({ summary: 'Get venues created by the current owner' })
    async findOwnerVenues(@Req() req: AuthenticatedRequest) {
        return {
            success: true,
            data: await this.venueService.findOwnerVenues(req.user.sub),
        };
    }

    @ApiBearerAuth()
    @Roles(Role.OWNER)
    @Patch(':id')
    @ApiOperation({ summary: 'Update owner venue and send it for re-approval' })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateVenueDto,
        @Req() req: AuthenticatedRequest,
    ) {
        return {
            success: true,
            message: 'Venue updated successfully and sent for admin approval.',
            data: await this.venueService.updateOwnerVenue(id, req.user.sub, dto),
        };
    }

    @ApiBearerAuth()
    @Roles(Role.OWNER)
    @Patch(':id/list')
    @ApiOperation({ summary: 'List approved owner venue' })
    async list(
        @Param('id', ParseUUIDPipe) id: string,
        @Req() req: AuthenticatedRequest,
    ) {
        return {
            success: true,
            message: 'Venue listed successfully.',
            data: await this.venueService.listOwnerVenue(id, req.user.sub),
        };
    }

    @ApiBearerAuth()
    @Roles(Role.OWNER)
    @Patch(':id/unlist')
    @ApiOperation({ summary: 'Unlist owner venue' })
    async unlist(
        @Param('id', ParseUUIDPipe) id: string,
        @Req() req: AuthenticatedRequest,
    ) {
        return {
            success: true,
            message: 'Venue unlisted successfully.',
            data: await this.venueService.unlistOwnerVenue(id, req.user.sub),
        };
    }

    @ApiBearerAuth()
    @Roles(Role.ADMIN)
    @Get('admin/all')
    @ApiOperation({ summary: 'Get all venues for admin management' })
    async findAllForAdmin() {
        return {
            success: true,
            data: await this.venueService.findAllForAdmin(),
        };
    }

    @ApiBearerAuth()
    @Roles(Role.ADMIN)
    @Get('admin/pending')
    @ApiOperation({ summary: 'Get all pending venues for approval' })
    async findPendingForAdmin() {
        return {
            success: true,
            data: await this.venueService.findPendingForAdmin(),
        };
    }

    @ApiBearerAuth()
    @Roles(Role.ADMIN)
    @Patch('admin/:id/approve')
    @ApiOperation({ summary: 'Approve venue' })
    async approve(@Param('id', ParseUUIDPipe) id: string) {
        return {
            success: true,
            message: 'Venue approved successfully.',
            data: await this.venueService.approveVenue(id),
        };
    }

    @ApiBearerAuth()
    @Roles(Role.ADMIN)
    @Patch('admin/:id/reject')
    @ApiOperation({ summary: 'Reject venue with a reason' })
    async reject(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: RejectVenueDto,
    ) {
        return {
            success: true,
            message: 'Venue rejected successfully.',
            data: await this.venueService.rejectVenue(id, dto),
        };
    }

    @Public()
    @Get(':id')
    @ApiOperation({ summary: 'Get public venue details by ID' })
    async findPublicById(@Param('id', ParseUUIDPipe) id: string) {
        return {
            success: true,
            data: await this.venueService.findPublicById(id),
        };
    }
}