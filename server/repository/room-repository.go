package repository

import (
	"squirrel/db"
	"squirrel/db/entities"
	"squirrel/utils"
	"strconv"

	sq "github.com/Masterminds/squirrel"
)

type roomRepo struct{}

var RoomRepo roomRepo

func (rr roomRepo) FindByID(roomId string) (*entities.Room, error) {
	sql, args, err :=
		sq.
			Select("*").
			From("rooms").
			Where(sq.Eq{"id": roomId}).
			PlaceholderFormat(sq.Dollar).
			ToSql()
	utils.Throw(err)

	var room entities.Room
	err = db.Q.Get(&room, sql, args...)
	if err != nil {
		return nil, err
	}

	return &room, nil
}

func (rr roomRepo) FindByIDs(ids []string) ([]*entities.Room, error) {
	sql, args, err :=
		sq.
			Select("*").
			From("rooms").
			Where(sq.Eq{"id": ids}).
			PlaceholderFormat(sq.Dollar).
			ToSql()
	utils.Throw(err)

	var rooms []*entities.Room
	err = db.Q.Select(&rooms, sql, args...)
	if err != nil {
		return nil, err
	}

	return rooms, nil
}

func (rr roomRepo) CreateRoom(userID string, title string, memberIds []string) (*entities.Room, error) {
	sql, args, err :=
		sq.
			Insert("rooms").
			Columns("title").
			Values(title).
			Suffix("RETURNING \"id\"").
			PlaceholderFormat(sq.Dollar).
			ToSql()
	utils.Throw(err)

	var roomID string
	err = db.Q.Get(&roomID, sql, args...)
	if err != nil {
		return nil, err
	}

	sb := sq.StatementBuilder.Insert("room_members").Columns("room_id", "user_id")
	for _, id := range memberIds {
		sb = sb.Values(roomID, id)
	}
	sql, args, err =
		sb.PlaceholderFormat(sq.Dollar).ToSql()
	utils.Throw(err)

	_, err = db.Q.Exec(sql, args...)
	utils.Throw(err)

	roomIDUint, _ := strconv.ParseUint(roomID, 10, 64)

	return &entities.Room{
		ID:    uint(roomIDUint),
		Title: title,
	}, nil
}

func (rr roomRepo) FindByIDIncludeMembers(roomId string) (*entities.Room, error) {
	sql, args, err :=
		sq.
			Select(`rooms.*, u.id as "user.id", u.name as "user.name"`).
			From("rooms").
			InnerJoin("room_members rm on rm.room_id = rooms.id").
			InnerJoin("users u on rm.user_id = u.id").
			Where(sq.Eq{"rooms.id": roomId}).
			PlaceholderFormat(sq.Dollar).
			ToSql()
	if err != nil {
		return nil, err
	}

	var room entities.Room

	rows, err := db.Q.Queryx(sql, args...)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		type roomRow struct {
			ID       uint   `db:"id"`
			Title    string `db:"title"`
			UserID   uint   `db:"user.id"`
			UserName string `db:"user.name"`
		}

		var rr roomRow
		err = rows.StructScan(&rr)
		if err != nil {
			return nil, err
		}

		room.ID = rr.ID
		room.Title = rr.Title
		room.Users = append(room.Users, entities.User{ID: rr.UserID, Name: rr.UserName})
	}

	return &room, nil
}

func (rr roomRepo) AddMember(roomID string, userID string) error {
	sql, args, err :=
		sq.
			Insert("room_members").
			Columns("user_id", "room_id").
			Values(userID, roomID).
			PlaceholderFormat(sq.Dollar).
			ToSql()
	if err != nil {
		return err
	}

	_, err = db.Q.Exec(sql, args...)
	if err != nil {
		return err
	}

	return nil
}
