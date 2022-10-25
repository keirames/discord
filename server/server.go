package main

import (
	"log"
	"net/http"
	"os"
	"squirrel/auth"
	"squirrel/config"
	"squirrel/db"
	"squirrel/graph"
	"squirrel/graph/generated"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/go-chi/chi"
	_ "github.com/lib/pq"
)

const defaultPort = "4000"

// type User struct {
// 	ID   uint   `db:"id"`
// 	Name string `db:"name"`
// }

// type Message struct {
// 	ID     uint   `db:"id"`
// 	Text   string `db:"text"`
// 	UserId uint   `db:"user_id"`
// 	RoomId uint   `db:"room_id"`
// 	User   User   `db:"user"`
// }

// sql, _, _ := sq.Select("*").From("messages").ToSql()
// 	messages := []Message{}
// 	db.Select(&messages, sql)
// 	fmt.Println("")
// 	fmt.Println(sql)
// 	fmt.Printf("%+v\n", messages)

// 	sql, _, _ =
// 		sq.
// 			Select(`messages.*, u.id as "user.id", u.name as "user.name"`).
// 			From("messages").InnerJoin("users u on u.id = messages.user_id").
// 			ToSql()
// 	newMessages := []Message{}
// 	db.Select(&newMessages, sql)
// 	fmt.Println("")
// 	fmt.Println(sql)
// 	fmt.Printf("%+v\n", newMessages)

func main() {
	config.LoadEnv()

	port := os.Getenv("PORT")

	db.ConnectDB()

	router := chi.NewRouter()

	router.Use(auth.ExtractTokenMiddleware1())
	router.Use(auth.Middleware())

	router.Handle("/", playground.Handler("GraphQL playground", "/query"))
	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &graph.Resolver{}}))
	router.Handle("/query", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}
