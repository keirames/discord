package entities

import "discord/graph/model"

type VoiceChannel struct {
	ID        string `db:"id"`
	Title     string `db:"title"`
	CreatedAt string `db:"created_at"`
}

func MapVoiceChannelToModel(vc VoiceChannel) *model.VoiceChannel {
	return &model.VoiceChannel{
		ID:        vc.ID,
		Title:     vc.Title,
		CreatedAt: vc.CreatedAt,
	}
}

func MapVoiceChannelsToModel(voiceChannels []VoiceChannel) []*model.VoiceChannel {
	voiceChannelsModel := make([]*model.VoiceChannel, len(voiceChannels))

	for idx, c := range voiceChannels {
		voiceChannelModel := MapVoiceChannelToModel(c)
		voiceChannelsModel[idx] = voiceChannelModel
	}

	return voiceChannelsModel
}
