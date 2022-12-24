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
	maxMessageSize = 1024
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
			fmt.Println("user register:", client.id)
			h.clients[client] = true

		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				// close any channel of this client
			}

		case msg := <-h.Direct:
			fmt.Println("got msg -> direct to ", msg.Id)
			for c := range h.clients {
				if c.id == msg.Id {
					err := c.conn.SetWriteDeadline(time.Now().Add(writeWait))
					if err != nil {
						fmt.Println(err)
						break
					}

					w, err := c.conn.NextWriter(websocket.TextMessage)
					if err != nil {
						fmt.Println(err)
						break
					}

					_, err = w.Write([]byte(msg.Payload))
					if err != nil {
						fmt.Println(err)
						break
					}

					if err := w.Close(); err != nil {
						fmt.Println(err)
					}
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
			PeerId string `json:"peerId"`
		}
		kafkaMsg := Data{RoomId: vcJoinEvent.RoomId, PeerId: c.id}
		kafkaMsgRaw, _ := json.Marshal(kafkaMsg)
		kafkaRepo.SendMessage("join_as_speaker", string(kafkaMsgRaw))
		fmt.Println("produce data -> topic join_as_speaker")

	case "voice-channel/connect_transport":
		kafkaRepo.SendMessage("connect_transport", string(eventData.Payload))
		fmt.Println("produce data -> topic connect_transport")

	case "voice-channel/send_track":
		kafkaRepo.SendMessage("send_track", string(eventData.Payload))
		fmt.Println("produce data -> topic send_track")

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
			} else {
				fmt.Println(err)
			}
			break
		}
		fmt.Println(string(payload))

		payload = bytes.TrimSpace(bytes.Replace(payload, newline, space, -1))

		handleSocketPayloadEvents(c, payload)
	}
}
