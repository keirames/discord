package directives

import (
	"context"
	"squirrel/middlewares"

	"github.com/99designs/gqlgen/graphql"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

func Auth(ctx context.Context, obj interface{}, next graphql.Resolver) (interface{}, error) {
	claims := middlewares.GetClaims(ctx)

	if claims == nil {
		return nil, &gqlerror.Error{
			Path:    graphql.GetPath(ctx),
			Message: "Unauthorized",
		}
	}

	return next(ctx)
}
