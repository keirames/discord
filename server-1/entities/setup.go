package entities

import (
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DbQuery *gorm.DB = nil

func ConnectDatabase() {
	dsn := "mysql:12345678@tcp(127.0.0.1:3307)/chat-app?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		panic("failed to connect database")
	}

	DbQuery = db
}
