package main

import (
	"context"
	"discord/config"
	"discord/db"
	"discord/directives"
	"discord/graph"
	"discord/graph/generated"
	"discord/middlewares"
	"discord/repository"
	"discord/service"
	wsService "discord/service/ws"
	"discord/utils"
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

func main() {
	config.LoadEnv()

	port := os.Getenv("PORT")

	db.ConnectDB()
	// kafkaRepo.KafkaService.Connect()

	router := chi.NewRouter()

	// WsHub control all users
	wsHub := wsService.NewWsHub()
	go wsHub.Run()

	router.Use(cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
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
	router.Handle("/ws", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		params := r.URL.Query()
		// TODO: should be const elsewhere ?
		token := params.Get("token")
		validate, err := service.ValidateJwt(context.Background(), token)
		if err != nil {
			utils.HttpUnauthorized(w)
			return
		}
		customClaims, ok := validate.Claims.(*service.JwtCustomClaim)
		if !ok {
			utils.HttpUnauthorized(w)
			return
		}

		_, err = repository.UserRepo.FindByID(customClaims.UserID)
		if err != nil {
			utils.HttpUnauthorized(w)
			return
		}

		wsService.WsHandler(wsHub, customClaims.UserID, w, r)
	}))

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}
