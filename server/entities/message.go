package entities

import (
	"server/graph/model"
	"strconv"

	"gorm.io/gorm"
)

type Message struct {
	gorm.Model
	Text   string
	RoomID uint
	UserID uint
}

func MapMessageWithModel(msg Message) model.Message {
	ca := msg.CreatedAt.String()
	ua := msg.UpdatedAt.String()
	da := msg.DeletedAt.Time.String()

	return model.Message{
		ID:        strconv.FormatUint(uint64(msg.ID), 10),
		Text:      msg.Text,
		UserID:    strconv.FormatUint(uint64(msg.UserID), 10),
		CreatedAt: ca,
		UpdatedAt: &ua,
		DeletedAt: &da,
	}
}

func MapMessagesWithModel(messages []*Message) []*model.Message {
	result := make([]*model.Message, len(messages))

	for index, msg := range messages {
		msgModel := MapMessageWithModel(*msg)
		result[index] = &msgModel
	}

	return result
}
