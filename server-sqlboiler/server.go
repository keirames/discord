package main

import (
	"context"
	"database/sql"
	"fmt"
	"server-sqlboiler/models"

	_ "github.com/volatiletech/sqlboiler/v4/drivers/sqlboiler-psql/driver"
	"github.com/volatiletech/sqlboiler/v4/queries/qm"
)

func main() {
	db, err := sql.Open("postgres", `dbname="chat-app" user=postgres password=password port=5433`)
	if err != nil {
		panic(err)
	}

	// messages, err := models.Messages(
	// 	qm.Where("room_id=?", 1),
	// qm.InnerJoin("users u on u.id = messages.user_id"),
	// ).All(context.TODO(), db)

	messages, err := models.Messages(qm.Where("id=?", 1)).One(context.TODO(), db)

	fmt.Println(messages)
}
