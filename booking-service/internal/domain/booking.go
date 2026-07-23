package domain

import (
	"errors"
	"time"
)

var (
	ErrBookingNotFound  = errors.New("booking not found")
	ErrVenueUnavailable = errors.New("venue is not available for the requested time slot")
	ErrBookingForbidden = errors.New("not authorized to manage this booking")
)

type BookingStatus string

const (
	StatusPending   BookingStatus = "pending"
	StatusConfirmed BookingStatus = "confirmed"
	StatusCancelled BookingStatus = "cancelled"
)

// Booking represents a reservation of a venue by a user for a time window.
type Booking struct {
	ID        string        `json:"id"`
	UserID    string        `json:"user_id"`
	VenueID   string        `json:"venue_id"`
	StartTime time.Time     `json:"start_time"`
	EndTime   time.Time     `json:"end_time"`
	Status    BookingStatus `json:"status"`
	CreatedAt time.Time     `json:"created_at"`
}

// BookingRepository is the persistence contract for bookings.
type BookingRepository interface {
	Create(b *Booking) error
	GetByID(id string) (*Booking, error)
	ListByUserID(userID string) ([]Booking, error)
	ListAll() ([]Booking, error)
	UpdateStatus(id string, status BookingStatus) error
	IsVenueAvailable(venueID string, start, end time.Time) (bool, error)
}

// BookingCache is the caching contract for bookings (backed by Redis).
type BookingCache interface {
	Set(b *Booking) error
	Get(id string) (*Booking, error)
	Delete(id string) error
}
