// Package venue implements the core business logic for venue management.
package venue

import (
	"booking-service/internal/domain"
	"errors"
)

// Service is the venue business-logic contract.
type Service interface {
	CreateVenue(ownerID, name, description, location, city, category string, capacity int, pricePerHour float64, images, amenities, highlights []string) (*domain.Venue, error)
	GetVenue(id string) (*domain.Venue, error)
	ListVenues() ([]domain.Venue, error)
	ListMyVenues(ownerID string) ([]domain.Venue, error)
	UpdateVenue(callerID, callerRole string, v *domain.Venue) error
	DeleteVenue(callerID, callerRole, venueID string) error
}

type venueService struct {
	repo domain.VenueRepository
}

func NewVenueService(repo domain.VenueRepository) Service {
	return &venueService{repo: repo}
}

func (s *venueService) CreateVenue(ownerID, name, description, location, city, category string, capacity int, price float64, images, amenities, highlights []string) (*domain.Venue, error) {
	v := &domain.Venue{
		OwnerID:      ownerID,
		Name:         name,
		Description:  description,
		Location:     location,
		City:         city,
		Category:     category,
		Capacity:     capacity,
		PricePerHour: price,
		Images:       images,
		Amenities:    amenities,
		Highlights:   highlights,
	}
	if err := s.repo.Create(v); err != nil {
		return nil, err
	}
	return v, nil
}

func (s *venueService) GetVenue(id string) (*domain.Venue, error) {
	return s.repo.GetByID(id)
}

func (s *venueService) ListVenues() ([]domain.Venue, error) {
	return s.repo.ListAll()
}

func (s *venueService) ListMyVenues(ownerID string) ([]domain.Venue, error) {
	return s.repo.ListByOwner(ownerID)
}

// UpdateVenue authorizes the caller — only the owning user or an admin may update.
func (s *venueService) UpdateVenue(callerID, callerRole string, v *domain.Venue) error {
	existing, err := s.repo.GetByID(v.ID)
	if err != nil {
		return err
	}
	if callerRole != domain.RoleAdmin && existing.OwnerID != callerID {
		return domain.ErrVenueForbidden
	}
	return s.repo.Update(v)
}

// DeleteVenue authorizes the caller — only the owning user or an admin may delete.
func (s *venueService) DeleteVenue(callerID, callerRole, venueID string) error {
	existing, err := s.repo.GetByID(venueID)
	if err != nil {
		return err
	}
	if callerRole != domain.RoleAdmin && existing.OwnerID != callerID {
		return domain.ErrVenueForbidden
	}
	return s.repo.Delete(venueID)
}

// IsForbidden is a helper for handlers to detect authorization errors.
func IsForbidden(err error) bool {
	return errors.Is(err, domain.ErrVenueForbidden)
}
