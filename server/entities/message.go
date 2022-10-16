package entities

import "gorm.io/gorm"

type Message struct {
	gorm.Model
	Text   string
	RoomID uint
}
