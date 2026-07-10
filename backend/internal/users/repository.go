package users

import (
	"context"

	"github.com/WeCode-Community-Dev/BookMyVenue/db/sqlc"
	"github.com/WeCode-Community-Dev/BookMyVenue/pkg/utils"
	"github.com/jackc/pgx/v5/pgtype"
)

type repository struct {
	db *sqlc.Queries
}

func newRepository(db *sqlc.Queries) *repository {
	return &repository{db: db}
}

func (r *repository) getAllVenues(ctx context.Context) ([]sqlc.Venue, error) {
	return r.db.GetAllVenues(ctx)
}

func (r *repository) getVenueAmenitiesByVenueIDs(ctx context.Context, venueIDs []pgtype.UUID) ([]sqlc.GetVenueAmenitiesByVenueIDsRow, error) {
	return r.db.GetVenueAmenitiesByVenueIDs(ctx, venueIDs)
}

func (r *repository) getVenueImagesByVenueIDs(ctx context.Context, imageIDs []pgtype.UUID) ([]sqlc.VenueImage, error) {
	return r.db.GetVenueImagesByVenueIDs(ctx, imageIDs)
}

func (r *repository) getVenueByID(ctx context.Context, venueID string) (sqlc.Venue, error) {
	venueUUID, err := utils.StringToUUID(venueID)
	if err != nil {
		return sqlc.Venue{}, err
	}
	return r.db.GetVenueByID(ctx, venueUUID)
}

func (r *repository) getBookedVenuesByUserID(ctx context.Context, userID string) ([]sqlc.Booking, error) {
	userUUID, err := utils.StringToUUID(userID)
	if err != nil {
		return []sqlc.Booking{}, err
	}
	return r.db.GetBookingsByUserID(ctx, userUUID)
}

func (r *repository) getslotByID(ctx context.Context, slotID pgtype.UUID) (sqlc.Availability, error) {
	return r.db.GetSlotByID(ctx, slotID)
}
