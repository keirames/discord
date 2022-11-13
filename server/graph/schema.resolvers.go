package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"
	"squirrel/db"
	"squirrel/db/entities"
	"squirrel/graph/generated"
	"squirrel/graph/model"
	kafkaRepo "squirrel/kafka_repo"
	"squirrel/middlewares"
	"squirrel/repository"
	"squirrel/service"
	"squirrel/utils"

	sq "github.com/Masterminds/squirrel"
	"golang.org/x/exp/slices"
)

// CreateRoom is the resolver for the createRoom field.
func (r *mutationResolver) CreateRoom(ctx context.Context, input model.NewRoom) (*model.Room, error) {
	memberIDs := utils.Uniq(input.Members)

	user := middlewares.GetUser(ctx)

	users, err := repository.UserRepo.FindByIDs(memberIDs)
	if err != nil {
		return nil, utils.UserInputError()
	}
	if len(users) == 0 {
		return nil, utils.UserInputError()
	}

	room, err := repository.RoomRepo.CreateRoom(utils.UintToString(user.ID), input.Title, memberIDs)
	if err != nil {
		return nil, utils.UserInputError()
	}

	kafkaRepo.MembersAddedProducer(utils.UintToString(room.ID), memberIDs)

	return entities.MapRoomToModel(*room), nil
}

// SendMessage is the resolver for the sendMessage field.
func (r *mutationResolver) SendMessage(ctx context.Context, input model.SendMessageInput) (*model.Message, error) {
	user := middlewares.GetUser(ctx)

	room, err := repository.RoomRepo.FindByID(input.RoomID)
	if err != nil {
		return nil, utils.UserInputError()
	}

	sql, args, err := sq.
		Insert("messages").
		Columns("text", "user_id", "room_id").
		Values(input.Text, user.ID, room.ID).
		Suffix("RETURNING \"id\"").
		PlaceholderFormat(sq.Dollar).
		ToSql()
	if err != nil {
		return nil, utils.UserInputError()
	}

	var msgID string
	err = db.Q.Get(&msgID, sql, args...)
	if err != nil {
		return nil, utils.UserInputError()
	}

	kafkaRepo.KafkaService.SendMessage(map[string]string{
		"userID": utils.UintToString(user.ID),
		"roomID": input.RoomID,
		"msg":    input.Text,
	})

	return &model.Message{
		ID:     msgID,
		Text:   input.Text,
		UserID: utils.UintToString(user.ID),
	}, nil
}

// AddMember is the resolver for the addMember field.
func (r *mutationResolver) AddMember(ctx context.Context, userID string, roomID string) (*model.User, error) {
	user := middlewares.GetUser(ctx)

	newMember, err := repository.UserRepo.FindByID(userID)
	if err != nil {
		return nil, utils.UserInputError()
	}

	room, err := repository.RoomRepo.FindByIDIncludeMembers(roomID)
	if err != nil {
		return nil, utils.UserInputError()
	}

	// You be a member of room ?
	idx := slices.IndexFunc(room.Users, func(u entities.User) bool {
		return u.ID == user.ID
	})
	if idx == -1 {
		return nil, utils.UserInputError()
	}

	// Is new member already in room
	idx = slices.IndexFunc(room.Users, func(u entities.User) bool {
		return u.ID == newMember.ID
	})
	if idx != -1 {
		newMemberModel := entities.MapUserToModel(*newMember)
		return &newMemberModel, nil
	}

	err = repository.RoomRepo.AddMember(roomID, utils.UintToString(newMember.ID))
	if err != nil {
		return nil, utils.UserInputError()
	}

	kafkaRepo.MemberAddedProducer(roomID, userID)

	newMemberModel := entities.MapUserToModel(*newMember)
	return &newMemberModel, nil
}

// KickMember is the resolver for the kickMember field.
func (r *mutationResolver) KickMember(ctx context.Context, userID string, roomID string) (*model.User, error) {
	panic(fmt.Errorf("not implemented: KickMember - kickMember"))
}

// DeleteMessage is the resolver for the deleteMessage field.
func (r *mutationResolver) DeleteMessage(ctx context.Context, messageID string) (*model.Message, error) {
	panic(fmt.Errorf("not implemented: DeleteMessage - deleteMessage"))
}

// SignIn is the resolver for the signIn field.
func (r *mutationResolver) SignIn(ctx context.Context, name string) (string, error) {
	user, err := repository.UserRepo.FindByName(name)
	if err != nil {
		return "", utils.UserInputError()
	}

	token, err := service.GenerateJwt(ctx, utils.UintToString(user.ID))
	if err != nil {
		return "", utils.UserInputError()
	}

	if !middlewares.IsFromMobile(ctx) {
		middlewares.SetCookie(ctx, token)
	}

	return token, nil
}

// Rooms is the resolver for the rooms field.
func (r *queryResolver) Rooms(ctx context.Context) ([]*model.Room, error) {
	sql, _, err :=
		sq.
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
					Users: []entities.User{{ID: rr.UserID, Name: rr.UserName}},
				},
			)
		}
	}

	return entities.MapRoomsToModel(rooms), nil
}

// Room is the resolver for the room field.
func (r *queryResolver) Room(ctx context.Context, id string) (*model.Room, error) {
	sql, args, err :=
		sq.
			Select(
				`
				rooms.*,
				u.id as "user.id",
				u.name as "user.name",
				m.id as "message.id",
				m.text as "message.text",
				m.user_id as "message.user_id"
				`,
			).
			From("rooms").
			InnerJoin("room_members rm on rm.room_id = rooms.id").
			InnerJoin("users u on rm.user_id = u.id").
			LeftJoin("messages m on rooms.id = m.room_id").
			Where(sq.Eq{"rooms.id": id}).
			PlaceholderFormat(sq.Dollar).
			ToSql()
	if err != nil {
		return nil, utils.UserInputError()
	}

	rows, err := db.Q.Queryx(sql, args...)
	if err != nil {
		return nil, utils.UserInputError()
	}

	var room entities.Room

	usersMap := map[uint]bool{}
	messagesMap := map[uint]bool{}

	for rows.Next() {
		type row struct {
			ID            uint   `db:"id"`
			Title         string `db:"title"`
			UserID        uint   `db:"user.id"`
			UserName      string `db:"user.name"`
			MessageID     uint   `db:"message.id"`
			Text          string `db:"message.text"`
			MessageUserID uint   `db:"message.user_id"`
		}

		var r row
		err := rows.StructScan(&r)
		if err != nil {
			return nil, utils.UserInputError()
		}

		room.ID = r.ID
		room.Title = r.Title

		_, ok := usersMap[r.UserID]
		if !ok {
			usersMap[r.UserID] = true
			room.Users = append(room.Users, entities.User{ID: r.UserID, Name: r.UserName})
		}

		_, ok = messagesMap[r.MessageID]
		if !ok {
			messagesMap[r.MessageID] = true
			room.Messages = append(room.Messages, entities.Message{
				ID:     r.MessageID,
				Text:   r.Text,
				UserID: r.MessageUserID,
			})
		}
	}

	return entities.MapRoomToModel(room), nil
}

// Messages is the resolver for the messages field.
func (r *queryResolver) Messages(ctx context.Context, roomID string) ([]*model.Message, error) {
	sql, args, err :=
		sq.
			Select(`messages.*, u.id as "user.id", u.name as "user.name"`).
			From("messages").
			InnerJoin("users u on u.id = messages.user_id").
			Where(sq.Eq{"room_id": roomID}).
			PlaceholderFormat(sq.Dollar).
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
