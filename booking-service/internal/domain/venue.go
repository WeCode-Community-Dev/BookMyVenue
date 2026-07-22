package domain

import (
	"errors"
	"time"
)

// Role constants shared between auth-service tokens and booking-service authorization.
const (
	RoleUser  = "user"
	RoleOwner = "owner"
	RoleAdmin = "admin"
)

var (
	ErrVenueNotFound  = errors.New("venue not found")
	ErrVenueForbidden = errors.New("not authorized to manage this venue")
)

// Venue represents a bookable space owned by a user with the owner role.
type Venue struct {
	ID           string    `json:"id"`
	OwnerID      string    `json:"owner_id"`
	Name         string    `json:"name"`
	Description  string    `json:"description"`
	Location     string    `json:"location"`
	City         string    `json:"city"`
	Category     string    `json:"category"`
	Capacity     int       `json:"capacity"`
	PricePerHour float64   `json:"price_per_hour"`
	Images       []string  `json:"images"`
	Amenities    []string  `json:"amenities"`
	Highlights   []string  `json:"highlights"`
	CreatedAt    time.Time `json:"created_at"`
}

// VenueRepository is the persistence contract for venues.
type VenueRepository interface {
	Create(v *Venue) error
	GetByID(id string) (*Venue, error)
	ListAll() ([]Venue, error)
	ListByOwner(ownerID string) ([]Venue, error)
	Update(v *Venue) error
	Delete(id string) error
}
