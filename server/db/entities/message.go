package entities

import (
	"squirrel/graph/model"
	"squirrel/utils"
)

type Message struct {
	ID     uint   `db:"id"`
	Text   string `db:"text"`
	RoomID uint   `db:"room_id"`
	UserID uint   `db:"user_id"`
	User   User   `db:"user"`
}

func MapMessageToModel(message Message) *model.Message {
	user := MapUserToModel(message.User)

	return &model.Message{
		ID:     utils.UintToString(message.ID),
		Text:   message.Text,
		UserID: utils.UintToString(message.UserID),
		User:   &user,
	}
}

func MapMessagesToModel(messages []Message) []*model.Message {
	messagesModel := make([]*model.Message, len(messages))

	for idx, msg := range messages {
		messagesModel[idx] = MapMessageToModel(msg)
	}

	return messagesModel
}
