package directives

import (
	"context"
	"fmt"
	"squirrel/middlewares"

	"github.com/99designs/gqlgen/graphql"
)

func Auth(ctx context.Context, obj interface{}, next graphql.Resolver) (interface{}, error) {
	claims := middlewares.GetClaims(ctx)
	fmt.Println("hi v%", claims)

	// TODO: using graphql error here

	return next(ctx)
}
