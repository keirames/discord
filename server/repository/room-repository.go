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
