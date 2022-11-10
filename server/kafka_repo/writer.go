package kafkaRepo

import (
	"context"
	"fmt"
	"log"

	"github.com/goccy/go-json"
	"github.com/segmentio/kafka-go"
)

var w *kafka.Writer

func createWriter() func() error {
	w = &kafka.Writer{
		// TODO: use env
		Addr:     kafka.TCP("localhost:9092"),
		Balancer: &kafka.LeastBytes{},
	}

	return w.Close
}

func SendMessage(topic string, msg string) {
	if w == nil {
		createWriter()
	}

	err := w.WriteMessages(context.Background(), kafka.Message{
		Topic: topic,
		// TODO: what is key ?
		Key:   []byte("random key"),
		Value: []byte(msg),
	})

	if err != nil {
		log.Fatal("failed to write messages:", err)
	}
}

type memberAddedEvent struct {
	RoomID string `json:"roomID"`
	UserID string `json:"userID"`
}

func MemberAddedProducer(roomID string, userID string) {
	const topic = "member-added"

	rawJson, err := json.Marshal(&memberAddedEvent{roomID, userID})
	if err != nil {
		fmt.Println(err)
		return
	}

	SendMessage(topic, string(rawJson))
}
