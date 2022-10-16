package entities

import (
	"server/graph/model"
	"strconv"

	"gorm.io/gorm"
)

type Room struct {
	gorm.Model
	Title    string
	Users    []*User   `gorm:"many2many:room_members"`
	Messages []Message `gorm:"foreignKey:RoomID"`
}

func (r Room) MapRoomWithModel() model.Room {
	ca := r.CreatedAt.String()
	ua := r.UpdatedAt.String()
	da := r.DeletedAt.Time.String()

	members := make([]*model.User, len(r.Users))
	for index, u := range r.Users {
		uModel := u.MapUserToModel()
		members[index] = &uModel
	}

	return model.Room{
		ID:        strconv.FormatUint(uint64(r.ID), 10),
		Title:     &r.Title,
		CreatedAt: ca,
		UpdatedAt: &ua,
		DeletedAt: &da,
		Members:   members,
	}
}

func MapRoomsWithModel(rooms []*Room) []*model.Room {
	result := make([]*model.Room, len(rooms))

	for index, room := range rooms {
		roomModel := room.MapRoomWithModel()
		result[index] = &roomModel
	}

	return result
}
