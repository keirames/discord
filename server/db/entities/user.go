package entities

import (
	"squirrel/graph/model"
	"squirrel/utils"
)

type User struct {
	ID   uint   `db:"id"`
	Name string `db:"name"`
}

func MapUserToModel(u User) model.User {
	return model.User{
		ID:   utils.UintToString(u.ID),
		Name: u.Name,
	}
}

func MapUsersToModel(users []User) []*model.User {
	usersModel := make([]*model.User, len(users))

	for idx, u := range users {
		userModel := MapUserToModel(u)
		usersModel[idx] = &userModel
	}

	return usersModel
}
