package utils

import (
	"errors"
	"math"
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

func NumericToInt64(n pgtype.Numeric) (int64, error) {
	if !n.Valid {
		return 0, errors.New("invalid numeric")
	}

	i := n.Int.Int64()

	switch {
	case n.Exp == 0:
		return i, nil
	case n.Exp > 0:
		return i * int64(math.Pow10(int(n.Exp))), nil
	default:
		return i / int64(math.Pow10(int(-n.Exp))), nil
	}
}
