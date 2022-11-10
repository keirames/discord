package kafkaRepo

import (
	"context"
	"encoding/json"
	"log"
	"time"

	"github.com/segmentio/kafka-go"
)

type kafkaService struct{}

var kafkaConn *kafka.Conn

var KafkaService = &kafkaService{}

func (ks kafkaService) Connect() {
	conn, err := kafka.DialLeader(context.Background(), "tcp", "localhost:9092", "chat", 0)
	if err != nil {
		log.Fatal("failed to dial leader:", err)
	}
	kafkaConn = conn
}

func (ks kafkaService) SendMessage(msg map[string]string) {
	kafkaConn.SetWriteDeadline(time.Now().Add(10 * time.Second))

	jsonMsg, _ := json.Marshal(msg)

	_, err := kafkaConn.WriteMessages(kafka.Message{Value: jsonMsg})
	if err != nil {
		log.Fatal("failed to write messages:", err)
	}

	// if err := kafkaConn.Close(); err != nil {
	// 	log.Fatal("failed to close writer:", err)
	// }
}
