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

// JoinVoiceRoom is the resolver for the joinVoiceRoom field.
func (r *mutationResolver) JoinVoiceRoom(ctx context.Context, id string) (string, error) {
	// roomIds, err := repository.VoiceRoomRepository.FindMemberIdsInRoomByRoomId(id)
	// if err != nil {
	// 	return nil, utils.UserInputError()
	// }

	panic(fmt.Errorf("not implemented: JoinVoiceRoom - joinVoiceRoom"))
}

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

	room, err := repository.RoomRepo.CreateRoom(user.ID, input.Title, memberIDs)
	if err != nil {
		return nil, utils.UserInputError()
	}

	kafkaRepo.MembersAddedProducer(room.ID, memberIDs)

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
		Suffix(`RETURNING "id", "created_at"`).
		PlaceholderFormat(sq.Dollar).
		ToSql()
	if err != nil {
		return nil, utils.UserInputError()
	}

	type row struct {
		ID        string `db:"id"`
		CreatedAt string `db:"created_at"`
	}

	var rowData row
	err = db.Q.Get(&rowData, sql, args...)
	if err != nil {
		return nil, utils.UserInputError()
	}

	kafkaRepo.MessageSentProducer(kafkaRepo.MessageSentEventParams{
		RoomID:           input.RoomID,
		UserID:           user.ID,
		MessageID:        rowData.ID,
		MessageText:      input.Text,
		MessageCreatedAt: rowData.CreatedAt,
	})

	return &model.Message{
		ID:        rowData.ID,
		Text:      input.Text,
		UserID:    user.ID,
		CreatedAt: rowData.CreatedAt,
	}, nil
}

// Seen is the resolver for the seen field.
func (r *mutationResolver) Seen(ctx context.Context, roomID string, messages []string) ([]string, error) {
	user := middlewares.GetUser(ctx)

	isExist, err := repository.RoomRepo.FindMemberInRoom("0be9da29-d3ac-49d6-b177-6cbab13a9139", "4a273821-89ce-41f3-a5db-dde6ab757ad9")
	if err != nil || isExist == nil {
		return nil, utils.UserInputError()
	}

	// TODO: is all messages exist ?

	sb :=
		sq.
			StatementBuilder.
			Insert("seen_members").
			Columns("user_id", "room_id", "message_id")
	for _, messageID := range messages {
		sb.Values(user.ID, roomID, messageID)
	}

	sql, args, err := sb.PlaceholderFormat(sq.Dollar).ToSql()
	if err != nil {
		return nil, utils.UserInputError()
	}

	_, err = db.Q.Exec(sql, args...)
	if err != nil {
		return nil, utils.UserInputError()
	}

	return messages, nil
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

	err = repository.RoomRepo.AddMember(roomID, newMember.ID)
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

	token, err := service.GenerateJwt(ctx, user.ID)
	if err != nil {
		return "", utils.UserInputError()
	}

	if !middlewares.IsFromMobile(ctx) {
		middlewares.SetCookie(ctx, token)
	}

	return token, nil
}

// Me is the resolver for the me field.
func (r *queryResolver) Me(ctx context.Context) (*model.User, error) {
	user := middlewares.GetUser(ctx)

	userModel := entities.MapUserToModel(*user)

	return &userModel, nil
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
			ID       string `db:"id"`
			Title    string `db:"title"`
			UserID   string `db:"user.id"`
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
				m.user_id as "message.user_id",
				m.created_at as "message.created_at"
				`,
			).
			From("rooms").
			InnerJoin("room_members rm on rm.room_id = rooms.id").
			InnerJoin("users u on rm.user_id = u.id").
			JoinClause(
				sq.
					Select("*").
					From("messages").
					OrderBy("messages.created_at desc").
					Prefix(`LEFT JOIN (`).
					Suffix(`) as m on rooms.id = m.room_id`),
			).
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

	usersMap := map[string]bool{}
	messagesMap := map[string]bool{}

	for rows.Next() {
		type row struct {
			ID               string `db:"id"`
			Title            string `db:"title"`
			UserID           string `db:"user.id"`
			UserName         string `db:"user.name"`
			MessageID        string `db:"message.id"`
			Text             string `db:"message.text"`
			MessageUserID    string `db:"message.user_id"`
			MessageCreatedAt string `db:"message.created_at"`
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
				ID:        r.MessageID,
				Text:      r.Text,
				UserID:    r.MessageUserID,
				CreatedAt: r.MessageCreatedAt,
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
