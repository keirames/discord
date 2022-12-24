package kafkaRepo

import (
	"context"
	"discord/topics"
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

func SendMessages(topic string, msgs []string) {
	if w == nil {
		createWriter()
	}

	kafkaMessages := make([]kafka.Message, len(msgs))
	for idx, msg := range msgs {
		// TODO: what is key ?
		kafkaMessages[idx] = kafka.Message{
			Topic: topic,
			Key:   []byte("random"),
			Value: []byte(msg),
		}
	}

	err := w.WriteMessages(
		context.Background(),
		kafkaMessages...,
	)

	if err != nil {
		log.Fatal("failed to write messages:", err)
	}
}

type memberAddedEvent struct {
	RoomID string `json:"roomId"`
	UserID string `json:"userId"`
}

func MemberAddedProducer(roomID string, userID string) {
	topic := topics.MemberAdded

	rawJson, err := json.Marshal(&memberAddedEvent{roomID, userID})
	if err != nil {
		fmt.Println(err)
		return
	}

	SendMessage(topic, string(rawJson))
}

func MembersAddedProducer(roomID string, userIDs []string) {
	topic := topics.MemberAdded

	rawJsonList := make([]string, len(userIDs))

	for idx, userID := range userIDs {
		rawJson, _ := json.Marshal(&memberAddedEvent{roomID, userID})
		rawJsonList[idx] = string(rawJson)
	}

	SendMessages(topic, rawJsonList)
}

type MessageSentEventParams struct {
	RoomID           string `json:"roomId"`
	UserID           string `json:"userId"`
	MessageID        string `json:"messageId"`
	MessageText      string `json:"messageText"`
	MessageCreatedAt string `json:"messageCreatedAt"`
}

func MessageSentProducer(params MessageSentEventParams) {
	topic := topics.MessageSent

	rawJson, err := json.Marshal(params)
	if err != nil {
		fmt.Println(err)
	}

	SendMessage(topic, string(rawJson))
}
