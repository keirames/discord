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
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/go-chi/chi"
	_ "github.com/lib/pq"
	"github.com/rs/cors"
	"github.com/segmentio/kafka-go"
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

func consume2(h *wsService.WsHub) {
	r := kafka.NewReader(kafka.ReaderConfig{
		Brokers: []string{"localhost:9092"},
		// TODO: learn further about group id
		GroupID:  "send_track_done group",
		Topic:    "send_track_done",
		MinBytes: 10e3, // 10KB
		MaxBytes: 10e6, // 10MB
	})
	fmt.Println("subscribe into topic send_track_done")

	for {
		fmt.Println("listen for new msg send_track_done")
		m, err := r.ReadMessage(context.Background())
		if err != nil {
			fmt.Println(err)
			break
		}
		type data struct {
			PeerId string `json:"peerId"`
		}
		var d data
		if err = json.Unmarshal(m.Value, &d); err != nil {
			continue
		}

		type eventData struct {
			EventName string `json:"eventName"`
			Payload   string `json:"payload"`
		}
		ed := eventData{EventName: "voice-channel/send_track_done", Payload: string(m.Value)}
		edInBytes, err := json.Marshal(ed)
		if err != nil {
			fmt.Println("send_track_done topic data cannot turn into bytes", err)
			continue
		}

		fmt.Println("got data from send_track_done")
		dm := &wsService.DirectMessage{Id: d.PeerId, Payload: string(edInBytes)}
		h.Direct <- dm
		fmt.Println("send direct msg to user")
	}

	if err := r.Close(); err != nil {
		log.Fatal("failed to close reader:", err)
	}
}

func consume4(h *wsService.WsHub) {
	r := kafka.NewReader(kafka.ReaderConfig{
		Brokers: []string{"localhost:9092"},
		// TODO: learn further about group id
		GroupID:  "recv_track_done group",
		Topic:    "recv_track_done",
		MinBytes: 10e3, // 10KB
		MaxBytes: 10e6, // 10MB
	})
	fmt.Println("subscribe into topic recv_track_done")

	for {
		fmt.Println("listen for new msg recv_track_done")
		m, err := r.ReadMessage(context.Background())
		if err != nil {
			fmt.Println(err)
			break
		}
		type data struct {
			PeerId string `json:"peerId"`
		}
		var d data
		if err = json.Unmarshal(m.Value, &d); err != nil {
			continue
		}

		type eventData struct {
			EventName string `json:"eventName"`
			Payload   string `json:"payload"`
		}
		ed := eventData{EventName: "voice-channel/recv_track_done", Payload: string(m.Value)}
		edInBytes, err := json.Marshal(ed)
		if err != nil {
			fmt.Println("recv_track_done topic data cannot turn into bytes", err)
			continue
		}

		fmt.Println("got data from recv_track_done")
		dm := &wsService.DirectMessage{Id: d.PeerId, Payload: string(edInBytes)}
		h.Direct <- dm
	}

	if err := r.Close(); err != nil {
		log.Fatal("failed to close reader:", err)
	}
}

func consume(h *wsService.WsHub) {
	r := kafka.NewReader(kafka.ReaderConfig{
		Brokers: []string{"localhost:9092"},
		// TODO: learn further about group id
		GroupID:  "you_joined_as_speaker group",
		Topic:    "you_joined_as_speaker",
		MinBytes: 10e3, // 10KB
		MaxBytes: 10e6, // 10MB
	})
	fmt.Println("subscribe into topic you_joined_as_speaker")

	for {
		m, err := r.ReadMessage(context.Background())
		if err != nil {
			fmt.Println(err)
			break
		}
		// fmt.Printf("message at topic/partition/offset %v/%v/%v: %s = %s\n", m.Topic, m.Partition, m.Offset, string(m.Key), string(m.Value))
		type data struct {
			PeerId string `json:"peerId"`
		}
		var d data
		if err = json.Unmarshal(m.Value, &d); err != nil {
			continue
		}

		type eventData struct {
			EventName string `json:"eventName"`
			Payload   string `json:"payload"`
		}
		ed := eventData{EventName: "voice-channel/you_joined_as_speaker", Payload: string(m.Value)}
		edInBytes, err := json.Marshal(ed)
		if err != nil {
			fmt.Println("you_joined_as_speaker topic data cannot turn into bytes", err)
			continue
		}

		fmt.Println("got data from you_joined_as_speaker")
		dm := &wsService.DirectMessage{Id: d.PeerId, Payload: string(edInBytes)}
		h.Direct <- dm
	}

	if err := r.Close(); err != nil {
		log.Fatal("failed to close reader:", err)
	}
}

func consume3(h *wsService.WsHub) {
	r := kafka.NewReader(kafka.ReaderConfig{
		Brokers: []string{"localhost:9092"},
		// TODO: learn further about group id
		GroupID:  "you_joined_as_peer group",
		Topic:    "you_joined_as_peer",
		MinBytes: 10e3, // 10KB
		MaxBytes: 10e6, // 10MB
	})
	fmt.Println("subscribe into topic you_joined_as_peer")

	for {
		m, err := r.ReadMessage(context.Background())
		if err != nil {
			fmt.Println(err)
			break
		}
		type data struct {
			PeerId string `json:"peerId"`
		}
		var d data
		if err = json.Unmarshal(m.Value, &d); err != nil {
			continue
		}

		fmt.Println("got data from you_joined_as_peer")
		dm := &wsService.DirectMessage{Id: d.PeerId, Payload: string(m.Value)}
		h.Direct <- dm
	}

	if err := r.Close(); err != nil {
		log.Fatal("failed to close reader:", err)
	}
}

func consume5(h *wsService.WsHub) {
	r := kafka.NewReader(kafka.ReaderConfig{
		Brokers: []string{"localhost:9092"},
		// TODO: learn further about group id
		GroupID:  "new_peer_speaker group",
		Topic:    "new_peer_speaker",
		MinBytes: 10e3, // 10KB
		MaxBytes: 10e6, // 10MB
	})
	fmt.Println("subscribe into topic new_peer_speaker")

	for {
		fmt.Println("listen for new msg new_peer_speaker")
		m, err := r.ReadMessage(context.Background())
		if err != nil {
			fmt.Println(err)
			break
		}
		type data struct {
			PeerId      string `json:"peerId"`
			TheirPeerId string `json:"theirPeerId"`
			RoomId      string `json:"roomId"`
		}
		var d data
		if err = json.Unmarshal(m.Value, &d); err != nil {
			continue
		}

		type eventData struct {
			EventName string `json:"eventName"`
			Payload   string `json:"payload"`
		}

		ed := eventData{EventName: "voice-channel/new_peer_speaker", Payload: string(m.Value)}
		edInBytes, err := json.Marshal(ed)
		if err != nil {
			fmt.Println("send_track_done topic data cannot turn into bytes", err)
			continue
		}

		dm := &wsService.DirectMessage{Id: d.TheirPeerId, Payload: string(edInBytes)}
		h.Direct <- dm

		// type eventData struct {
		// 	EventName string `json:"eventName"`
		// 	Payload   string `json:"payload"`
		// }
		// ed := eventData{EventName: "voice-channel/send_track_done", Payload: string(m.Value)}
		// edInBytes, err := json.Marshal(ed)
		// if err != nil {
		// 	fmt.Println("send_track_done topic data cannot turn into bytes", err)
		// 	continue
		// }

		// fmt.Println("got data from send_track_done")
		// dm := &wsService.DirectMessage{Id: d.PeerId, Payload: string(edInBytes)}
		// h.Direct <- dm
		// fmt.Println("send direct msg to user")
	}

	if err := r.Close(); err != nil {
		log.Fatal("failed to close reader:", err)
	}
}

func main() {
	config.LoadEnv()

	port := os.Getenv("PORT")

	db.ConnectDB()
	// kafkaRepo.KafkaService.Connect()

	router := chi.NewRouter()

	// WsHub control all users
	wsHub := wsService.NewWsHub()
	go wsHub.Run()

	// kafka consumers
	go consume(wsHub)
	go consume2(wsHub)
	go consume3(wsHub)
	go consume4(wsHub)
	go consume5(wsHub)

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
