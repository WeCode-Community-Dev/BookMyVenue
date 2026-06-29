import { Controller, HttpStatus, Post, UseGuards, Get, Body, Patch, Delete, Query } from '@nestjs/common';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AdminVenueService } from './admin-venue.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { CurrentUser, CurrentUserPayload } from 'src/common/decorators/current-user.decorator';
import { Param } from '@nestjs/common';
import { ParseUUIDPipe } from '@nestjs/common';
import { VenueStatus } from 'src/common/enums/venue-status.enum';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminVenueController {
    constructor(private readonly adminVenue: AdminVenueService) { }

    @Get('venues/pending')
    @Roles(UserRole.ADMIN)
    getPendingRequest(@CurrentUser() user: CurrentUserPayload) {
        return this.adminVenue.PendingVenues();
    }

    @Get('venues/:venueId')
    @Roles(UserRole.ADMIN)
    getPendingDetail(
        @Param('venueId', ParseUUIDPipe) venueId: string,
        @CurrentUser() user: CurrentUserPayload,
    ) {
        return this.adminVenue.PendingVenueDetails(venueId);
    }

    @Post('venues/:venueId/accept')
    @Roles(UserRole.ADMIN)
    AcceptVerification(
        @Param('venueId', ParseUUIDPipe) venueId: string,
        @Body('reviewNotes') reviewNotes: string,
        @CurrentUser() user: CurrentUserPayload,
    ) {
        return this.adminVenue.AcceptVerification(venueId, reviewNotes);
    }

    @Post('venues/:venueId/reject')
    @Roles(UserRole.ADMIN)
    RejectVerification(
        @Param('venueId', ParseUUIDPipe) venueId: string,
        @Body('reviewNotes') reviewNotes: string,
        @CurrentUser() user: CurrentUserPayload,
    ) {
        return this.adminVenue.RejectVerification(venueId, reviewNotes);
    }

    @Post('venues/:venueId/changes')
    @Roles(UserRole.ADMIN)
    RequestChanges(
        @Param('venueId', ParseUUIDPipe) venueId: string,
        @Body('reviewNotes') reviewNotes: string,
        @CurrentUser() user: CurrentUserPayload,
    ) {
        return this.adminVenue.RequestChanges(venueId, reviewNotes);
    }

    @Get('admin/venues')
    @Roles(UserRole.ADMIN)
    getVenues(@Query('status') status?: VenueStatus) {
        return this.adminVenue.getVenues(status);
    }

    @Get('admin/venues/:venueId')
    @Roles(UserRole.ADMIN)
    getVenueDetails(@Param('venueId', ParseUUIDPipe) venueId: string) {
        return this.adminVenue.getVenueDetails(venueId);
    }

    @Get('admin/venues/:venueId/photos')
    @Roles(UserRole.ADMIN)
    getVenuePhotos(@Param('venueId', ParseUUIDPipe) venueId: string) {
        return this.adminVenue.getVenuePhotos(venueId);
    }

    @Get('admin/venues/:venueId/docs')
    @Roles(UserRole.ADMIN)
    getVenueDocs(@Param('venueId', ParseUUIDPipe) venueId: string) {
        return this.adminVenue.getVenueDocs(venueId);
    }

    @Get('admin/customers')
    @Roles(UserRole.ADMIN)
    getCustomers() {
        return this.adminVenue.getCustomers();
    }

    @Get('admin/customers/:id')
    @Roles(UserRole.ADMIN)
    getCustomerDetails(@Param('id', ParseUUIDPipe) id: string) {
        return this.adminVenue.getCustomerDetails(id);
    }

    @Get('admin/venue-owners')
    @Roles(UserRole.ADMIN)
    getVenueOwners() {
        return this.adminVenue.getVenueOwners();
    }

    @Get('admin/venue-owners/:id')
    @Roles(UserRole.ADMIN)
    getVenueOwnerDetails(@Param('id', ParseUUIDPipe) id: string) {
        return this.adminVenue.getVenueOwnerDetails(id);
    }

    @Patch('admin/users/:id')
    @Roles(UserRole.ADMIN)
    updateUser(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateData: { name?: string; email?: string; phone?: string; isActive?: boolean },
    ) {
        return this.adminVenue.updateUser(id, updateData);
    }

    @Delete('admin/users/:id')
    @Roles(UserRole.ADMIN)
    deleteUser(@Param('id', ParseUUIDPipe) id: string) {
        return this.adminVenue.deleteUser(id);
    }
}
