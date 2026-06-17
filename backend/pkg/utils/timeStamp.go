package utils

import (
	"errors"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
)

func StringToTimeStamp(s string) (pgtype.Timestamp, error) {
	t, err := time.Parse("2006-01-02 15:04", s)
	if err != nil {
		return pgtype.Timestamp{}, errors.New("invalid timestamp: " + s)
	}

	return pgtype.Timestamp{
		Time:  t,
		Valid: true,
	}, nil
}
