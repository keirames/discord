package entities

import (
	"server/graph/model"
	"strconv"
)

type User struct {
	ID    uint `gorm:"primaryKey"`
	Name  string
	Rooms []*Room `gorm:"many2many:room_members"`
}

func (u User) MapUserToModel() model.User {
	return model.User{
		ID:   strconv.FormatUint(uint64(u.ID), 10),
		Name: u.Name,
	}
}

type Users []User

func (users Users) MapUsersToModel() []*model.User {
	result := make([]*model.User, len(users))

	for _, user := range users {
		userModel := user.MapUserToModel()
		result = append(result, &userModel)
	}

	return result
}
