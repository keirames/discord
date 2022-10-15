package model

import (
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DbQuery *gorm.DB = nil

func ConnectDatabase() {
	dsn := "mysql:12345678@tcp(127.0.0.1:3307)/chat-app?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	DbQuery = db
}
