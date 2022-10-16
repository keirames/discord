package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"
	"server/entities"
	customErrors "server/graph/errors"
	"server/graph/generated"
	"server/graph/model"
)

// CreateTodo is the resolver for the createTodo field.
func (r *mutationResolver) CreateTodo(ctx context.Context, input model.NewTodo) (*model.Todo, error) {
	panic(fmt.Errorf("not implemented: CreateTodo - createTodo"))
}

// CreateRoom is the resolver for the createRoom field.
func (r *mutationResolver) CreateRoom(ctx context.Context, input model.NewRoom) (*model.Room, error) {
	roomTitle := *input.Title
	memberIds := input.Members

	if len(memberIds) == 0 {
		return nil, customErrors.BadRequest()
	}

	var members []entities.User
	// Keep panic cause the only way make query error is db down
	entities.DbQuery.Where("id IN ?", memberIds).Find(&members)

	if len(members) == 0 {
		return nil, customErrors.BadRequest()
	}

	if len(roomTitle) == 0 {
		genName := ""
		for _, m := range members {
			genName = genName + ", " + m.Name
		}
		roomTitle = genName
	}

	newRoom := entities.Room{
		Title: roomTitle,
	}

	err := entities.DbQuery.Create(&newRoom).Error
	if err != nil {
		return nil, customErrors.BadRequest()
	}
	fmt.Println(newRoom)

	return nil, nil
}

// Todos is the resolver for the todos field.
func (r *queryResolver) Todos(ctx context.Context) ([]*model.Todo, error) {
	todo := make([]*model.Todo, 0)

	return todo, nil
}

// Rooms is the resolver for the rooms field.
func (r *queryResolver) Rooms(ctx context.Context) ([]*model.Room, error) {
	var rooms []*model.Room

	err := entities.DbQuery.Find(model.Room{}).First(&rooms).Error
	if err != nil {
		return nil, nil
	}

	return rooms, nil
}

// Room is the resolver for the room field.
func (r *queryResolver) Room(ctx context.Context, id string) (*model.Room, error) {
	panic(fmt.Errorf("not implemented: Room - room"))
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
