package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"

	dbConn "server/db/sqlc"

	_ "github.com/lib/pq"
)

var db *dbConn.Queries

func init() {
	conn, err := sql.Open("postgres", "host=localhost dbname=chat-app user=postgres password=password port=5433 sslmode=disable")
	if err != nil {
		log.Fatalf("could not connect to database: %v", err)
	}

	db = dbConn.New(conn)

	fmt.Println("database connected successfully...")
}

func main() {
	users, err := db.ListUsers(context.TODO(), dbConn.ListUsersParams{Limit: 10, Offset: 0})
	if err != nil {
	}

	fmt.Println(users)
}
