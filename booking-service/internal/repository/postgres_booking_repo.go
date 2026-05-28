package repository

import (
	"booking-service/internal/domain"
	"context"
	"errors"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type postgresBookingRepo struct {
	db *pgxpool.Pool
}

// NewPostgresBookingRepository returns a BookingRepository backed by PostgreSQL.
func NewPostgresBookingRepository(db *pgxpool.Pool) domain.BookingRepository {
	return &postgresBookingRepo{db: db}
}

func (r *postgresBookingRepo) Create(b *domain.Booking) error {
	q := `INSERT INTO bookings (user_id, venue_id, start_time, end_time, status)
	      VALUES ($1,$2,$3,$4,$5)
	      RETURNING id, created_at`
	return r.db.QueryRow(context.Background(), q,
		b.UserID, b.VenueID, b.StartTime, b.EndTime, b.Status,
	).Scan(&b.ID, &b.CreatedAt)
}

func (r *postgresBookingRepo) GetByID(id string) (*domain.Booking, error) {
	q := `SELECT id, user_id, venue_id, start_time, end_time, status, created_at
	      FROM bookings WHERE id = $1`
	var b domain.Booking
	err := r.db.QueryRow(context.Background(), q, id).Scan(
		&b.ID, &b.UserID, &b.VenueID, &b.StartTime, &b.EndTime, &b.Status, &b.CreatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrBookingNotFound
		}
		return nil, err
	}
	return &b, nil
}

func (r *postgresBookingRepo) ListByUserID(userID string) ([]domain.Booking, error) {
	q := `SELECT id, user_id, venue_id, start_time, end_time, status, created_at
	      FROM bookings WHERE user_id = $1 ORDER BY created_at DESC`
	return r.scanBookings(q, userID)
}

func (r *postgresBookingRepo) ListAll() ([]domain.Booking, error) {
	q := `SELECT id, user_id, venue_id, start_time, end_time, status, created_at
	      FROM bookings ORDER BY created_at DESC`
	return r.scanBookings(q)
}

func (r *postgresBookingRepo) UpdateStatus(id string, status domain.BookingStatus) error {
	tag, err := r.db.Exec(context.Background(),
		`UPDATE bookings SET status=$1 WHERE id=$2`, status, id)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return domain.ErrBookingNotFound
	}
	return nil
}

// IsVenueAvailable returns true when no active (non-cancelled) booking overlaps
// the requested [start, end) window for the given venue.
func (r *postgresBookingRepo) IsVenueAvailable(venueID string, start, end time.Time) (bool, error) {
	q := `SELECT COUNT(*) FROM bookings
	      WHERE venue_id = $1 AND status != 'cancelled'
	      AND start_time < $3 AND end_time > $2`
	var count int
	err := r.db.QueryRow(context.Background(), q, venueID, start, end).Scan(&count)
	if err != nil {
		return false, err
	}
	return count == 0, nil
}

func (r *postgresBookingRepo) scanBookings(q string, args ...any) ([]domain.Booking, error) {
	rows, err := r.db.Query(context.Background(), q, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var bookings []domain.Booking
	for rows.Next() {
		var b domain.Booking
		if err := rows.Scan(&b.ID, &b.UserID, &b.VenueID, &b.StartTime,
			&b.EndTime, &b.Status, &b.CreatedAt); err != nil {
			return nil, err
		}
		bookings = append(bookings, b)
	}
	return bookings, rows.Err()
}
