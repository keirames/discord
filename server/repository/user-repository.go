package repository

import (
	"squirrel/db"
	"squirrel/db/entities"
	"squirrel/utils"

	"github.com/Masterminds/squirrel"
)

type userRepo struct{}

var UserRepo userRepo

func (ur userRepo) FindByName(name string) (*entities.User, error) {
	sql, args, err :=
		squirrel.
			Select("*").
			From("users").
			Where(squirrel.Eq{"name": name}).
			PlaceholderFormat(squirrel.Dollar).
			ToSql()
	utils.Throw(err)

	var user entities.User
	err = db.Q.Get(&user, sql, args...)
	if err != nil {
		return nil, err
	}

	return &user, nil
}
