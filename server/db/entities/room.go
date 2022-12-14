package entities

import "discord/graph/model"

type Room struct {
	ID       string    `db:"id"`
	Title    string    `db:"title"`
	Users    []User    `db:"user"`
	Messages []Message `db:"message"`
}

func MapRoomToModel(r Room) *model.Room {
	return &model.Room{
		ID:       r.ID,
		Title:    &r.Title,
		Members:  MapUsersToModel(r.Users),
		Messages: MapMessagesToModel(r.Messages),
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
