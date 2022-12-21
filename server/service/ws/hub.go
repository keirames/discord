package wsService

import (
	"bytes"
	kafkaRepo "discord/kafka_repo"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/gorilla/websocket"
)

const (
	// Time allowed to write a message to the peer.
	writeWait = 10 * time.Second

	// Time allowed to read the next pong message from the peer.
	pongWait = 60 * time.Second

	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod = (pongWait * 9) / 10

	// Maximum message size allowed from peer.
	maxMessageSize = 512
)

var (
	newline = []byte{'\n'}
	space   = []byte{' '}
)

// Client is a middleman between the websocket connection and the ws hub.
type Client struct {
	id    string
	wsHub *WsHub
	conn  *websocket.Conn
}

type DirectMessage struct {
	Id      string
	Payload string
}

// Hub maintains the set of active clients to transfer message when necessarily
type WsHub struct {
	// Registered clients.
	clients map[*Client]bool

	// Register requests from the clients.
	register chan *Client

	// Unregister requests from clients.
	unregister chan *Client

	Direct chan *DirectMessage
}

func NewWsHub() *WsHub {
	return &WsHub{
		clients:    make(map[*Client]bool),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		Direct:     make(chan *DirectMessage),
	}
}

func (h *WsHub) Run() {
	for {
		select {
		case client := <-h.register:
			fmt.Println("some one register into wsHub")
			h.clients[client] = true

		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				// close any channel of this client
			}

		case msg := <-h.Direct:
			fmt.Printf("%+v", msg)
			fmt.Println("got msg -> direct to ", msg.Id)
			for c := range h.clients {
				if c.id == msg.Id {
					c.conn.SetWriteDeadline(time.Now().Add(writeWait))
					w, err := c.conn.NextWriter(websocket.TextMessage)
					if err != nil {
						break
					}
					w.Write([]byte(msg.Payload))
				}
			}
		}
	}
}

func handleSocketPayloadEvents(c *Client, payload []byte) {
	type EventData struct {
		EventName string `json:"eventName"`
		Payload   string `json:"payload"`
	}
	var eventData EventData
	if err := json.Unmarshal(payload, &eventData); err != nil {
		log.Printf("error: %v", err)
		return
	}

	switch eventData.EventName {
	case "voice-channel/join":
		type VoiceChannelJoinEvent struct {
			RoomId string `json:"roomId"`
		}
		var vcJoinEvent VoiceChannelJoinEvent
		if err := json.Unmarshal([]byte(eventData.Payload), &vcJoinEvent); err != nil {
			log.Printf("error: %v", err)
			return
		}

		type Data struct {
			RoomId string `json:"roomId"`
			UserId string `json:"userId"`
		}
		kafkaMsg := Data{RoomId: vcJoinEvent.RoomId, UserId: c.id}
		kafkaMsgRaw, _ := json.Marshal(kafkaMsg)
		kafkaRepo.SendMessage("voice_channel_join", string(kafkaMsgRaw))

	default:
		fmt.Println("unknown event -> skip")
	}
}

// readPump pumps messages from the websocket connection to the hub.
func (c *Client) readPump() {
	defer func() {
		c.wsHub.unregister <- c
		c.conn.Close()
	}()

	c.conn.SetReadLimit(maxMessageSize)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error {
		c.conn.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	})

	for {
		_, payload, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}

		payload = bytes.TrimSpace(bytes.Replace(payload, newline, space, -1))

		handleSocketPayloadEvents(c, payload)
	}
}
