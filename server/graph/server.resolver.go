package graph

import (
	"context"
	"discord/graph/model"
	"fmt"
)

// Servers is the resolver for the servers field.
func (r *queryResolver) Servers(ctx context.Context) ([]*model.Server, error) {

	panic(fmt.Errorf("not implemented: Servers - servers"))
}

// Server is the resolver for the server field.
func (r *queryResolver) Server(ctx context.Context, id string) (*model.Server, error) {
	panic(fmt.Errorf("not implemented: Server - server"))
}
