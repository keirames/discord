package repository

import (
	"squirrel/db"
	"squirrel/db/entities"
	"squirrel/utils"

	"github.com/Masterminds/squirrel"
)

func GetById(roomId string) (*entities.Room, error) {
	sql, args, err :=
		squirrel.
			Select("*").
			From("rooms").
			Where(squirrel.Eq{"id": roomId}).
			PlaceholderFormat(squirrel.Dollar).
			ToSql()
	utils.Throw(err)

	var room entities.Room
	err = db.Q.Get(&room, sql, args...)
	if err != nil {
		return nil, err
	}

	return &room, nil
}
