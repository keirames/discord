package entities

import "discord/graph/model"

type VoiceRoom struct {
	ID        string `db:"id"`
	Title     string `db:"name"`
	CreatedAt string `db:"created_at"`
}

func MapVoiceRoomToModel(vr VoiceRoom) model.VoiceRoom {
	return model.VoiceRoom{
		ID:        vr.ID,
		Title:     vr.Title,
		CreatedAt: vr.CreatedAt,
	}
}
