package entities

import (
	"squirrel/graph/model"
	"squirrel/utils"
)

type Room struct {
	ID    uint   `db:"id"`
	Title string `db:"title"`
	Users []User `db:"user"`
}

func MapRoomToModel(r Room) *model.Room {
	return &model.Room{
		ID:      utils.UintToString(r.ID),
		Title:   &r.Title,
		Members: MapUsersToModel(r.Users),
	}
}

func MapRoomsToModel(rooms []Room) []*model.Room {
	roomsModel := make([]*model.Room, len(rooms))

	for idx, r := range rooms {
		roomModel := MapRoomToModel(r)
		roomsModel[idx] = roomModel
	}

	return roomsModel
}
