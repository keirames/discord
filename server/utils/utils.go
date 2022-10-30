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

// TODO: generics solution ?
func Uniq(sliceList []string) []string {
	allKeys := make(map[string]bool)
	list := []string{}

	for _, item := range sliceList {
		if _, value := allKeys[item]; !value {
			allKeys[item] = true
			list = append(list, item)
		}
	}

	return list
}
