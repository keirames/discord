package entities

import "discord/graph/model"

type Server struct {
	ID            string         `db:"id"`
	Title         string         `db:"title"`
	CreatedAt     string         `db:"created_at"`
	VoiceChannels []VoiceChannel `db:"voice_channel"`
}

func MapServerToModel(r Server) *model.Server {
	return &model.Server{
		ID:            r.ID,
		Title:         r.Title,
		CreatedAt:     r.CreatedAt,
		VoiceChannels: MapVoiceChannelsToModel(r.VoiceChannels),
	}
}
