package db

import (
	"log"

	"github.com/jmoiron/sqlx"
)

var Q *sqlx.DB

func ConnectDB() {
	conn, err := sqlx.Connect("postgres", "host=localhost dbname=chat-app user=postgres password=password port=5433 sslmode=disable")
	if err != nil {
		log.Fatalln(err)
	}

	Q = conn
}
