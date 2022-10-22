package utils

import "strconv"

func UintToString(n uint) string {
	return strconv.FormatUint(uint64(n), 10)
}

func Throw(err error) {
	if err != nil {
		panic(err)
	}
}
