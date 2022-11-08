package kafkaRepo

import (
	"context"
	"log"
	"time"

	"github.com/segmentio/kafka-go"
)

type kafkaService struct{}

var KafkaService = &kafkaService{}

func (ks kafkaService) SendMessage(msg []byte) {
	conn, err := kafka.DialLeader(context.Background(), "tcp", "localhost:9092", "chat", 0)
	if err != nil {
		log.Fatal("failed to dial leader:", err)
	}

	conn.SetWriteDeadline(time.Now().Add(10 * time.Second))

	_, err = conn.WriteMessages(kafka.Message{Value: msg})
	if err != nil {
		log.Fatal("failed to write messages:", err)
	}

	if err := conn.Close(); err != nil {
		log.Fatal("failed to close writer:", err)
	}
}
