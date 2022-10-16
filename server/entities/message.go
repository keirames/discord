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
}

func MapMessageWithModel(msg Message) model.Message {
	ca := msg.CreatedAt.String()
	ua := msg.UpdatedAt.String()
	da := msg.DeletedAt.Time.String()

	return model.Message{
		ID:        strconv.FormatUint(uint64(msg.ID), 10),
		Text:      msg.Text,
		CreatedAt: ca,
		UpdatedAt: &ua,
		DeletedAt: &da,
	}
}
