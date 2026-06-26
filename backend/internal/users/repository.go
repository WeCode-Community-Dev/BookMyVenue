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

func (r *repository) getAmenitiesForVenue(ctx context.Context, venueID pgtype.UUID) ([]sqlc.Amenity, error) {
	return r.db.GetAmenitiesForVenue(ctx, venueID)
}

func (r *repository) getVenueImagesByVenueID(ctx context.Context, venueID pgtype.UUID) ([]sqlc.VenueImage, error) {
	return r.db.GetVenueImages(ctx, venueID)
}

func (r *repository) getVenueByID(ctx context.Context, venueID string) (sqlc.Venue, error) {
	venueUUID, err := utils.StringToUUID(venueID)
	if err != nil {
		return sqlc.Venue{}, err
	}
	return r.db.GetVenueByID(ctx, venueUUID)
}
