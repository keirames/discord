package wsService

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

func reader(conn *websocket.Conn) {
	for {
		// read in a message
		messageType, p, err := conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}
		// print out that message for clarity
		log.Println(string(p))

		if err := conn.WriteMessage(messageType, p); err != nil {
			log.Println(err)
			return
		}
	}
}

func WsHandler(wsHub *WsHub, userId string, w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	client := &Client{id: userId, wsHub: wsHub, conn: ws}

	// register itself into wsHub
	client.wsHub.register <- client

	// log.Println("Client Connected")
	// err = ws.WriteMessage(1, []byte("Hi Client!"))
	// if err != nil {
	// 	log.Println(err)
	// }
	// listen indefinitely for new messages coming
	// through on our WebSocket connection
	go client.readPump()
}
