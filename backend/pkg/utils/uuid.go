package utils

import (
	"errors"

	"github.com/jackc/pgx/v5/pgtype"
)

func StringToUUID(id string) (pgtype.UUID, error) {
	var uuid pgtype.UUID
	err := uuid.Scan(id)
	if err != nil {
		return pgtype.UUID{}, errors.New("invalid uuid: " + id)
	}
	return uuid, nil
}
