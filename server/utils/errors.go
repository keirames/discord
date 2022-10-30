package utils

import "github.com/vektah/gqlparser/v2/gqlerror"

func UserInputError() *gqlerror.Error {
	return gqlerror.Errorf("BAD_USER_INPUT")
}

func AuthenticationError() *gqlerror.Error {
	return gqlerror.Errorf("UNAUTHENTICATED")
}

func ForbiddenError() *gqlerror.Error {
	return gqlerror.Errorf("FORBIDDEN")
}
