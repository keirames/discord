package main

import (
	"log"
	"net/http"
	"os"
	"server/graph"
	"server/graph/generated"
	"server/graph/model"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"gorm.io/gorm"
)

const defaultPort = "3000"

type Messages struct {
	gorm.Model
	Text   string
	RoomID uint
}

type Rooms struct {
	gorm.Model
	Title    string
	Users    []*User    `gorm:"many2many:user_rooms"`
	Messages []Messages `gorm:"foreignKey:RoomID"`
}

type User struct {
	ID    uint `gorm:"primaryKey"`
	Name  string
	Rooms []*Rooms `gorm:"many2many:user_rooms"`
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	model.ConnectDatabase()

	// Migration
	model.DbQuery.AutoMigrate(&User{}, &Messages{}, &Rooms{})

	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &graph.Resolver{}}))

	http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/query", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
