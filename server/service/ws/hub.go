package wsService

import (
	"bytes"
	kafkaRepo "discord/kafka_repo"
	"discord/utils"
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
	pongWait = 10 * time.Second

	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod = (pongWait * 9) / 10

	// Maximum message size allowed from peer.
	maxMessageSize = 4069
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

type BroadcastMessage struct {
	To      []string
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

	Broadcast chan *BroadcastMessage
}

func NewWsHub() *WsHub {
	return &WsHub{
		clients:    make(map[*Client]bool),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		Direct:     make(chan *DirectMessage),
		Broadcast:  make(chan *BroadcastMessage),
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

		case msg := <-h.Broadcast:
			for c := range h.clients {
				if utils.Contains(msg.To, c.id) {
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

		// TODO: Is this ping mechanism make sense ?
		// memberIds, err := repository.VoiceRoomRepository.FindMemberIdsInRoomByRoomId(vcJoinEvent.RoomId)
		// if err != nil {
		// 	fmt.Printf("Ping members err: %v", err)
		// 	return
		// }
		//
		// type p struct {
		// 	Id string `json:"id"`
		// }
		// eventPayloadInBytes, err := json.Marshal(&p{Id: c.id})
		// if err != nil {
		// 	fmt.Printf("Cannot turn members ping data into bytes: %v", err)
		// 	return
		// }
		// broadcastPayloadInBytes, err := json.Marshal(&EventData{
		// 	EventName: "voice-channel/member-joined",
		// 	Payload:   string(eventPayloadInBytes),
		// })
		// if err != nil {
		// 	fmt.Printf("Cannot turn members ping data broadcast into bytes: %v", err)
		// 	return
		// }

		// // remove this user id from broadcast
		// c.wsHub.Broadcast <- &BroadcastMessage{
		// 	To:      utils.Remove(*memberIds, c.id),
		// 	Payload: string(broadcastPayloadInBytes),
		// }

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

	case "voice-channel/connect_recv_transport":
		kafkaRepo.SendMessage("connect_recv_transport", string(eventData.Payload))
		fmt.Println("produce data -> topic connect_recv_transport")

	case "voice-channel/send_track":
		kafkaRepo.SendMessage("send_track", string(eventData.Payload))
		fmt.Println("produce data -> topic send_track")

	case "voice-channel/recv_track":
		kafkaRepo.SendMessage("recv_track", string(eventData.Payload))
		fmt.Println("produce data -> topic recv_track")

	case "voice-channel/join-as-peer":
		type VoiceChannelJoinAsPeerEvent struct {
			RoomId string `json:"roomId"`
		}
		var vcEvent VoiceChannelJoinAsPeerEvent
		if err := json.Unmarshal([]byte(eventData.Payload), &vcEvent); err != nil {
			log.Printf("error: %v", err)
			return
		}

		type Data struct {
			RoomId string `json:"roomId"`
			PeerId string `json:"peerId"`
		}
		kafkaMsg := Data{RoomId: vcEvent.RoomId, PeerId: c.id}
		kafkaMsgRaw, _ := json.Marshal(kafkaMsg)
		kafkaRepo.SendMessage("join_as_peer", string(kafkaMsgRaw))
		fmt.Println("produce -> topic join_as_peer")
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

// writePump pumps messages from the hub to the websocket connection.
func (c *Client) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()

	for {
		select {
		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			err := c.conn.WriteMessage(websocket.PingMessage, []byte{})
			if err != nil {
				fmt.Println("ping error", err)
				return
			}
		}
	}
}
