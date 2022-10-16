package entities

import (
	"server/graph/model"
	"strconv"

	"gorm.io/gorm"
)

type Room struct {
	gorm.Model
	Title    string
	Users    []*User   `gorm:"many2many:user_rooms"`
	Messages []Message `gorm:"foreignKey:RoomID"`
}

func (r Room) MapRoomWithModel() model.Room {
	ca := r.CreatedAt.String()
	ua := r.UpdatedAt.String()
	da := r.DeletedAt.Time.String()

	return model.Room{
		ID:        strconv.FormatUint(uint64(r.ID), 10),
		Title:     &r.Title,
		CreatedAt: ca,
		UpdatedAt: &ua,
		DeletedAt: da,
	}
}

type Rooms []Room

func (rooms Rooms) MapRoomsWithModel() []*model.Room {
	result := make([]*model.Room, len(rooms))

	for _, room := range rooms {
		roomModel := room.MapRoomWithModel()
		result = append(result, &roomModel)
	}

	return result
}
