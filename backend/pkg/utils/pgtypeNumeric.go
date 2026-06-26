package utils

import (
	"math/big"

	"github.com/jackc/pgx/v5/pgtype"
)

func Int64ToNumeric(v int64) pgtype.Numeric {
	return pgtype.Numeric{
		Int:   big.NewInt(v),
		Exp:   0,
		Valid: true,
	}
}
