package bookings

import (
	"context"

	"github.com/WeCode-Community-Dev/BookMyVenue/db/sqlc"
	"github.com/WeCode-Community-Dev/BookMyVenue/pkg/utils"
	"github.com/jackc/pgx/v5"
)

type repository struct {
	db *sqlc.Queries
}

func newRepository(db *sqlc.Queries) *repository {
	return &repository{db: db}
}

func (r *repository) getSlotForUpdate(ctx context.Context, tx pgx.Tx, slotID string) (sqlc.Availability, error) {
	slotUUID, err := utils.StringToUUID(slotID)
	if err != nil {
		return sqlc.Availability{}, err
	}
	qtx := r.db.WithTx(tx)
	return qtx.GetSlotForUpdate(ctx, slotUUID)
}

func (r *repository) updateAvailabilityBooked(ctx context.Context, slotID string) error {
	slotUUID, err := utils.StringToUUID(slotID)
	if err != nil {
		return err
	}

	return r.db.MarkSlotBooked(ctx, slotUUID)
}

func (r *repository) markSlotBooked(ctx context.Context, slotID string) error {
	slotUUID, err := utils.StringToUUID(slotID)
	if err != nil {
		return err
	}
	return r.db.MarkSlotBooked(ctx, slotUUID)
}

func (r *repository) createBooking(ctx context.Context, tx pgx.Tx, params sqlc.CreateBookingParams) (sqlc.Booking, error) {
	qtx := r.db.WithTx(tx)
	return qtx.CreateBooking(ctx, params)
}

func (r *repository) updateBookingStatus(ctx context.Context, bookingID, status string) error {
	bookingUUID, err := utils.StringToUUID(bookingID)
	if err != nil {
		return err
	}

	return r.db.UpdateBookingStatus(ctx, sqlc.UpdateBookingStatusParams{
		ID:     bookingUUID,
		Status: status,
	})
}
