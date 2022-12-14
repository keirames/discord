package entities

import "discord/graph/model"

type Message struct {
	ID        string `db:"id"`
	Text      string `db:"text"`
	RoomID    string `db:"room_id"`
	UserID    string `db:"user_id"`
	User      User   `db:"user"`
	CreatedAt string `db:"created_at"`
}

func MapMessageToModel(message Message) *model.Message {
	user := MapUserToModel(message.User)

	return &model.Message{
		ID:        message.ID,
		Text:      message.Text,
		UserID:    message.UserID,
		User:      &user,
		CreatedAt: message.CreatedAt,
	}
}

func MapMessagesToModel(messages []Message) []*model.Message {
	messagesModel := make([]*model.Message, len(messages))

	for idx, msg := range messages {
		messagesModel[idx] = MapMessageToModel(msg)
	}

	return messagesModel
}
