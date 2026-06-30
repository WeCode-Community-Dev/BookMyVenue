package bookings

import (
	"context"
	"database/sql"
	"errors"
	"math"

	"github.com/WeCode-Community-Dev/BookMyVenue/db/sqlc"
	"github.com/WeCode-Community-Dev/BookMyVenue/pkg/redis"
	"github.com/WeCode-Community-Dev/BookMyVenue/pkg/utils"
	"github.com/jackc/pgx/v5/pgxpool"
)

type service struct {
	repo *repository
	lock *lock
	pool *pgxpool.Pool
}

func newService(db *sqlc.Queries, pool *pgxpool.Pool, redis *redis.Client) *service {
	return &service{
		repo: newRepository(db),
		lock: newLock(redis),
		pool: pool,
	}
}

func (s *service) bookSlot(ctx context.Context, slotID, userID string) (*sqlc.Booking, error) {

	if err := s.lock.aquire(ctx, slotID, userID); err != nil {
		return nil, err
	}

	tx, err := s.pool.Begin(ctx)
	if err != nil {
		s.lock.Release(ctx, slotID)
		return nil, errors.New("failed to start transaction")
	}
	defer func() {
		_ = tx.Rollback(ctx)
	}()

	slot, err := s.repo.getSlotForUpdate(ctx, tx, slotID)
	if err != nil {
		s.lock.Release(ctx, slotID)
		if err == sql.ErrNoRows {
			return nil, errors.New("slot not found")
		}
		return nil, err
	}

	venue, err := s.repo.db.GetVenueByID(ctx, slot.VenueID)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("Venue not found")
		}
		return nil, err
	}

	totalAmount, err := calculateTotalAmount(slot, venue)
	if err != nil {
		return nil, err
	}

	totalAmountNumeric := utils.Int64ToNumeric(totalAmount)

	userUUID, err := utils.StringToUUID(userID)
	if err != nil {
		return nil, err
	}

	booking, err := s.repo.createBooking(ctx, tx, sqlc.CreateBookingParams{
		UserID:      userUUID,
		VenueID:     slot.VenueID,
		SlotID:      slot.ID,
		TotalAmount: totalAmountNumeric,
		Status:      "pending",
	})
	if err != nil {
		s.lock.Release(ctx, slot.ID.String())
		return nil, errors.New("failed to create booking")
	}

	if err := tx.Commit(ctx); err != nil {
		s.lock.Release(ctx, slot.ID.String())
		return nil, errors.New("failed to confirm booking")
	}

	return &booking, nil
}

func (s *service) confirmBooking(ctx context.Context, bookingID, slotID string) error {
	err := s.repo.markSlotBooked(ctx, slotID)
	if err != nil {
		return errors.New("failed to mark slot as booked")
	}

	err = s.repo.updateBookingStatus(ctx, bookingID, "confirmed")
	if err != nil {
		return errors.New("failed to confirm booking")
	}

	err = s.repo.updateAvailabilityBooked(ctx, slotID)
	if err != nil {
		return errors.New("failed to mark slot as booked")
	}

	// release Redis lock — slot is now permanently booked in DB
	s.lock.Release(ctx, slotID)

	return nil
}

func (s *service) cancelBooking(ctx context.Context, bookingID string) error {
	slotID, err := s.repo.getSlotByBookingID(ctx, bookingID)
	if err != nil {
		return errors.New("cannot get slotID " + err.Error())
	}

	err = s.repo.markSlotCancelled(ctx, slotID)
	if err != nil {
		return errors.New("failed to mark slot as cancelled ")
	}

	err = s.repo.updateBookingStatus(ctx, bookingID, "cancelled")
	if err != nil {
		return errors.New("failed to cancel booking")
	}

	return nil
}

func calculateTotalAmount(slot sqlc.Availability, venue sqlc.Venue) (int64, error) {
	startTime := slot.StartTime
	endTime := slot.EndTime

	price_per_hour := venue.PricePerHour
	price_per_day := venue.PricePerDay

	duration := endTime.Time.Sub(startTime.Time)
	hours := duration.Hours()
	if hours < 8 {
		return int64(hours * price_per_hour), nil
	} else {
		days := math.Ceil(hours / 8)
		return int64(days * price_per_day), nil
	}
}
