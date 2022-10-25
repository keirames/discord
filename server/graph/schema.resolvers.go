package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"
	"squirrel/config"
	"squirrel/db"
	"squirrel/db/entities"
	"squirrel/graph/generated"
	"squirrel/graph/model"
	"squirrel/repository"
	"squirrel/utils"
	"time"

	"github.com/Masterminds/squirrel"
	"github.com/golang-jwt/jwt/v4"
)

// CreateRoom is the resolver for the createRoom field.
func (r *mutationResolver) CreateRoom(ctx context.Context, input model.NewRoom) (*model.Room, error) {
	panic(fmt.Errorf("not implemented: CreateRoom - createRoom"))
}

// SendMessage is the resolver for the sendMessage field.
func (r *mutationResolver) SendMessage(ctx context.Context, input model.SendMessageInput) (*model.Message, error) {
	panic(fmt.Errorf("not implemented: SendMessage - sendMessage"))
}

// AddMember is the resolver for the addMember field.
func (r *mutationResolver) AddMember(ctx context.Context, userID string, roomID string) (string, error) {
	panic(fmt.Errorf("not implemented: AddMember - addMember"))
}

// KickMember is the resolver for the kickMember field.
func (r *mutationResolver) KickMember(ctx context.Context, userID string, roomID string) (string, error) {
	panic(fmt.Errorf("not implemented: KickMember - kickMember"))
}

// DeleteMessage is the resolver for the deleteMessage field.
func (r *mutationResolver) DeleteMessage(ctx context.Context, messageID string) (string, error) {
	panic(fmt.Errorf("not implemented: DeleteMessage - deleteMessage"))
}

// SignIn is the resolver for the signIn field.
func (r *mutationResolver) SignIn(ctx context.Context, name string) (string, error) {
	user, err := repository.UserRepo.FindByName(name)
	if err != nil {
		fmt.Println(err)
		panic("bad request")
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"name": user.Name,
		"exp":  time.Now().Add(time.Hour * time.Duration(1)).Unix(),
		"nbf":  time.Date(2015, 10, 10, 12, 0, 0, 0, time.UTC).Unix(),
	})
	tokenString, err := token.SignedString([]byte(config.JWT_SECRET))
	if err != nil {
		fmt.Println(err)
		panic("bad request")
	}

	// auth.SetCookie(ctx, tokenString)

	return tokenString, nil
}

// Rooms is the resolver for the rooms field.
func (r *queryResolver) Rooms(ctx context.Context) ([]*model.Room, error) {
	sql, _, err :=
		squirrel.
			Select(`rooms.*, u.id as "user.id", u.name as "user.name"`).
			From("rooms").
			InnerJoin("room_members rm on rm.room_id = rooms.id").
			InnerJoin("users u on rm.user_id = u.id").
			ToSql()
	utils.Throw(err)

	rows, err := db.Q.Queryx(sql)
	utils.Throw(err)

	rooms := []entities.Room{}
	for rows.Next() {
		// specific struct
		type roomRow struct {
			ID       uint   `db:"id"`
			Title    string `db:"title"`
			UserID   uint   `db:"user.id"`
			UserName string `db:"user.name"`
		}
		var rr roomRow
		rows.StructScan(&rr)

		idx := -1
		for rIdx, r := range rooms {
			if r.ID == rr.ID {
				fmt.Println(rIdx)
				idx = rIdx
			}
		}

		// room exist
		if idx != -1 {
			rooms[idx].Users = append(
				rooms[idx].Users,
				entities.User{
					ID:   rr.UserID,
					Name: rr.UserName})
		} else {
			rooms = append(
				rooms,
				entities.Room{
					ID:    rr.ID,
					Title: rr.Title,
					Users: []entities.User{{ID: rr.ID, Name: rr.UserName}},
				},
			)
		}
	}

	return entities.MapRoomsToModel(rooms), nil
}

// Room is the resolver for the room field.
func (r *queryResolver) Room(ctx context.Context, id string) (*model.Room, error) {
	sql, args, err :=
		squirrel.
			Select(`rooms.*, u.id as "user.id", u.name as "user.name"`).
			From("rooms").
			InnerJoin("room_members rm on rm.room_id = rooms.id").
			InnerJoin("users u on rm.user_id = u.id").
			Where(squirrel.Eq{"rooms.id": id}).
			PlaceholderFormat(squirrel.Dollar).
			ToSql()
	utils.Throw(err)
	fmt.Println(sql)

	rows, err := db.Q.Queryx(sql, args...)
	utils.Throw(err)

	var room entities.Room
	for rows.Next() {
		type roomRow struct {
			ID       uint   `db:"id"`
			Title    string `db:"title"`
			UserID   uint   `db:"user.id"`
			UserName string `db:"user.name"`
		}

		var rr roomRow
		utils.Throw(rows.StructScan(&rr))

		room.ID = rr.ID
		room.Title = rr.Title
		room.Users = append(room.Users, entities.User{ID: rr.UserID, Name: rr.UserName})
	}

	return entities.MapRoomToModel(room), nil
}

// Messages is the resolver for the messages field.
func (r *queryResolver) Messages(ctx context.Context, roomID string) ([]*model.Message, error) {
	sql, args, err :=
		squirrel.
			Select(`messages.*, u.id as "user.id", u.name as "user.name"`).
			From("messages").
			InnerJoin("users u on u.id = messages.user_id").
			Where(squirrel.Eq{"room_id": roomID}).
			PlaceholderFormat(squirrel.Dollar).
			ToSql()
	utils.Throw(err)
	fmt.Println(sql)

	var messages []entities.Message
	utils.Throw(db.Q.Select(&messages, sql, args...))

	return entities.MapMessagesToModel(messages), nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
