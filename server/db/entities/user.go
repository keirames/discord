package entities

import "discord/graph/model"

type User struct {
	ID        string `db:"id"`
	Name      string `db:"name"`
	CreatedAt string `db:"created_at"`
}

func MapUserToModel(u User) model.User {
	return model.User{
		ID:   u.ID,
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
