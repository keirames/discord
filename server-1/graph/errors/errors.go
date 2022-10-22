package customErrors

import "github.com/vektah/gqlparser/v2/gqlerror"

func NotFound() *gqlerror.Error {
	return gqlerror.Errorf("Not found")
}

func BadRequest() *gqlerror.Error {
	return gqlerror.Errorf("Bad Request")
}
