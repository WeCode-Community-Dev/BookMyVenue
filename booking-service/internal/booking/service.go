// Package booking implements the core business logic for booking management.
package booking

import (
	"booking-service/internal/domain"
	"errors"
	"log"
	"time"
)

// Service is the booking business-logic contract.
type Service interface {
	CreateBooking(userID, venueID string, start, end time.Time) (*domain.Booking, error)
	GetBooking(callerID, callerRole, bookingID string) (*domain.Booking, error)
	ListUserBookings(userID string) ([]domain.Booking, error)
	ListAllBookings() ([]domain.Booking, error)
	CancelBooking(callerID, callerRole, bookingID string) error
}

type bookingService struct {
	repo  domain.BookingRepository
	cache domain.BookingCache
}

func NewBookingService(repo domain.BookingRepository, cache domain.BookingCache) Service {
	return &bookingService{repo: repo, cache: cache}
}

func (s *bookingService) CreateBooking(userID, venueID string, start, end time.Time) (*domain.Booking, error) {
	available, err := s.repo.IsVenueAvailable(venueID, start, end)
	if err != nil {
		return nil, err
	}
	if !available {
		return nil, domain.ErrVenueUnavailable
	}

	b := &domain.Booking{
		UserID:    userID,
		VenueID:   venueID,
		StartTime: start,
		EndTime:   end,
		Status:    domain.StatusConfirmed,
	}
	if err := s.repo.Create(b); err != nil {
		return nil, err
	}
	if err := s.cache.Set(b); err != nil {
		log.Printf("cache.Set booking %s: %v", b.ID, err)
	}
	return b, nil
}

// GetBooking checks cache first; falls back to DB and repopulates cache on miss.
// Any caller may read their own bookings; admins may read any booking.
func (s *bookingService) GetBooking(callerID, callerRole, id string) (*domain.Booking, error) {
	b, err := s.cache.Get(id)
	if err != nil {
		if !errors.Is(err, domain.ErrBookingNotFound) {
			log.Printf("cache.Get booking %s: %v", id, err)
		}
		b, err = s.repo.GetByID(id)
		if err != nil {
			return nil, err
		}
		if cacheErr := s.cache.Set(b); cacheErr != nil {
			log.Printf("cache.Set booking %s: %v", id, cacheErr)
		}
	}

	if callerRole != domain.RoleAdmin && b.UserID != callerID {
		return nil, domain.ErrBookingForbidden
	}
	return b, nil
}

func (s *bookingService) ListUserBookings(userID string) ([]domain.Booking, error) {
	return s.repo.ListByUserID(userID)
}

func (s *bookingService) ListAllBookings() ([]domain.Booking, error) {
	return s.repo.ListAll()
}

// CancelBooking allows the booking owner or an admin to cancel.
func (s *bookingService) CancelBooking(callerID, callerRole, id string) error {
	b, err := s.repo.GetByID(id)
	if err != nil {
		return err
	}
	if callerRole != domain.RoleAdmin && b.UserID != callerID {
		return domain.ErrBookingForbidden
	}
	if err := s.repo.UpdateStatus(id, domain.StatusCancelled); err != nil {
		return err
	}
	if err := s.cache.Delete(id); err != nil {
		log.Printf("cache.Delete booking %s: %v", id, err)
	}
	return nil
}
