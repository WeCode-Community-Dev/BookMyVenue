package repository

import (
	"booking-service/internal/domain"
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type postgresVenueRepo struct {
	db *pgxpool.Pool
}

// NewPostgresVenueRepository returns a VenueRepository backed by PostgreSQL.
func NewPostgresVenueRepository(db *pgxpool.Pool) domain.VenueRepository {
	return &postgresVenueRepo{db: db}
}

func (r *postgresVenueRepo) Create(v *domain.Venue) error {
	q := `INSERT INTO venues (owner_id, name, description, location, capacity, price_per_hour)
	      VALUES ($1,$2,$3,$4,$5,$6)
	      RETURNING id, created_at`
	return r.db.QueryRow(context.Background(), q,
		v.OwnerID, v.Name, v.Description, v.Location, v.Capacity, v.PricePerHour,
	).Scan(&v.ID, &v.CreatedAt)
}

func (r *postgresVenueRepo) GetByID(id string) (*domain.Venue, error) {
	q := `SELECT id, owner_id, name, description, location, capacity, price_per_hour, created_at
	      FROM venues WHERE id = $1`
	var v domain.Venue
	err := r.db.QueryRow(context.Background(), q, id).Scan(
		&v.ID, &v.OwnerID, &v.Name, &v.Description, &v.Location,
		&v.Capacity, &v.PricePerHour, &v.CreatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrVenueNotFound
		}
		return nil, err
	}
	return &v, nil
}

func (r *postgresVenueRepo) ListAll() ([]domain.Venue, error) {
	q := `SELECT id, owner_id, name, description, location, capacity, price_per_hour, created_at
	      FROM venues ORDER BY created_at DESC`
	return r.scanVenues(q)
}

func (r *postgresVenueRepo) ListByOwner(ownerID string) ([]domain.Venue, error) {
	q := `SELECT id, owner_id, name, description, location, capacity, price_per_hour, created_at
	      FROM venues WHERE owner_id = $1 ORDER BY created_at DESC`
	return r.scanVenues(q, ownerID)
}

func (r *postgresVenueRepo) Update(v *domain.Venue) error {
	q := `UPDATE venues SET name=$1, description=$2, location=$3, capacity=$4, price_per_hour=$5
	      WHERE id=$6`
	tag, err := r.db.Exec(context.Background(), q,
		v.Name, v.Description, v.Location, v.Capacity, v.PricePerHour, v.ID,
	)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return domain.ErrVenueNotFound
	}
	return nil
}

func (r *postgresVenueRepo) Delete(id string) error {
	tag, err := r.db.Exec(context.Background(), `DELETE FROM venues WHERE id=$1`, id)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return domain.ErrVenueNotFound
	}
	return nil
}

// scanVenues is a helper that runs a SELECT query and collects rows into a slice.
func (r *postgresVenueRepo) scanVenues(q string, args ...any) ([]domain.Venue, error) {
	rows, err := r.db.Query(context.Background(), q, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var venues []domain.Venue
	for rows.Next() {
		var v domain.Venue
		if err := rows.Scan(&v.ID, &v.OwnerID, &v.Name, &v.Description, &v.Location,
			&v.Capacity, &v.PricePerHour, &v.CreatedAt); err != nil {
			return nil, err
		}
		venues = append(venues, v)
	}
	return venues, rows.Err()
}
