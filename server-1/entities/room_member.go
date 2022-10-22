package entities

import (
	"time"

	"gorm.io/gorm"
)

type RoomMembers struct {
	UserID    int `gorm:"primaryKey"`
	RoomID    int `gorm:"primaryKey"`
	CreatedAt time.Time
	DeletedAt gorm.DeletedAt
}
