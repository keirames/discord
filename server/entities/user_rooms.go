package entities

import (
	"time"

	"gorm.io/gorm"
)

type UserRooms struct {
	UserID    int `gorm:"primaryKey"`
	RoomID    int `gorm:"primaryKey"`
	CreatedAt time.Time
	DeletedAt gorm.DeletedAt
}
