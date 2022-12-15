package main

import (
	"discord/config"
	"discord/db"
	"discord/directives"
	"discord/graph"
	"discord/graph/generated"
	"discord/middlewares"
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/go-chi/chi"
	_ "github.com/lib/pq"
	"github.com/rs/cors"
)

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

// var upgrader = websocket.Upgrader{
// 	ReadBufferSize:  1024,
// 	WriteBufferSize: 1024,
// 	CheckOrigin:     func(r *http.Request) bool { return true },
// }

// func reader(conn *websocket.Conn) {
// 	for {
// 		// read in a message
// 		messageType, p, err := conn.ReadMessage()
// 		if err != nil {
// 			log.Println(err)
// 			return
// 		}
// 		// print out that message for clarity
// 		log.Println(string(p))

// 		if err := conn.WriteMessage(messageType, p); err != nil {
// 			log.Println(err)
// 			return
// 		}
// 	}
// }

func main() {
	config.LoadEnv()

	port := os.Getenv("PORT")

	db.ConnectDB()
	// kafkaRepo.KafkaService.Connect()

	router := chi.NewRouter()

	router.Use(cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowCredentials: true,
		Debug:            true,
	}).Handler)
	router.Use(middlewares.DeviceMiddleware())
	router.Use(middlewares.AuthHeaderMiddleware())
	router.Use(middlewares.CookieMiddleware())

	c := generated.Config{Resolvers: &graph.Resolver{}}
	c.Directives.Auth = directives.Auth
	srv := handler.NewDefaultServer(generated.NewExecutableSchema(c))

	router.Handle("/", playground.Handler("GraphQL playground", "/query"))
	router.Handle("/query", srv)
	// router.Handle("/ws", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	// 	ws, err := upgrader.Upgrade(w, r, nil)
	// 	if err != nil {
	// 		log.Println(err)
	// 	}

	// 	log.Println("Client Connected")
	// 	err = ws.WriteMessage(1, []byte("Hi Client!"))
	// 	if err != nil {
	// 		log.Println(err)
	// 	}
	// 	// listen indefinitely for new messages coming
	// 	// through on our WebSocket connection
	// 	reader(ws)
	// }))

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}
