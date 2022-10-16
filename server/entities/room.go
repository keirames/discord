package entities

import "gorm.io/gorm"

type Room struct {
	gorm.Model
	Title    string
	Users    []*User   `gorm:"many2many:user_rooms"`
	Messages []Message `gorm:"foreignKey:RoomID"`
}
