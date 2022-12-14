package repository

import (
	"discord/db"
	"discord/db/entities"
	"discord/utils"

	sq "github.com/Masterminds/squirrel"
)

type userRepo struct{}

var UserRepo userRepo

func (ur userRepo) FindByID(id string) (*entities.User, error) {
	sql, args, err := sq.
		Select("*").
		From("users").
		Where(sq.Eq{"id": id}).
		PlaceholderFormat(sq.Dollar).
		ToSql()
	if err != nil {
		return nil, err
	}

	var user entities.User
	err = db.Q.Get(&user, sql, args...)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (ur userRepo) FindByName(name string) (*entities.User, error) {
	sql, args, err :=
		sq.
			Select("*").
			From("users").
			Where(sq.Eq{"name": name}).
			PlaceholderFormat(sq.Dollar).
			ToSql()
	utils.Throw(err)

	var user entities.User
	err = db.Q.Get(&user, sql, args...)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (ur userRepo) FindByIDs(ids []string) ([]*entities.User, error) {
	sql, args, err :=
		sq.
			Select("*").
			From("users").
			Where(sq.Eq{"id": ids}).
			PlaceholderFormat(sq.Dollar).
			ToSql()
	utils.Throw(err)

	var users []*entities.User
	err = db.Q.Select(&users, sql, args...)
	if err != nil {
		return nil, err
	}

	return users, nil
}
