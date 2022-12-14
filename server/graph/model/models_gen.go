// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

type Guild struct {
	ID            string          `json:"id"`
	Name          string          `json:"name"`
	CreatedAt     string          `json:"createdAt"`
	VoiceChannels []*VoiceChannel `json:"voiceChannels"`
}

type Message struct {
	ID        string `json:"id"`
	Text      string `json:"text"`
	UserID    string `json:"userId"`
	User      *User  `json:"user"`
	CreatedAt string `json:"createdAt"`
}

type NewRoom struct {
	Title   string   `json:"title"`
	Members []string `json:"members"`
}

type Room struct {
	ID       string     `json:"id"`
	Title    *string    `json:"title"`
	Members  []*User    `json:"members"`
	Messages []*Message `json:"messages"`
}

type SendMessageInput struct {
	RoomID string `json:"roomId"`
	Text   string `json:"text"`
}

type User struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type VoiceChannel struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	CreatedAt string `json:"createdAt"`
}

type VoiceRoom struct {
	ID        string `json:"id"`
	Title     string `json:"title"`
	CreatedAt string `json:"createdAt"`
}
