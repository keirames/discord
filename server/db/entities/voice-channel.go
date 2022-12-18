package entities

import "discord/graph/model"

type VoiceChannel struct {
	ID        string `db:"id"`
	Name      string `db:"name"`
	CreatedAt string `db:"created_at"`
	GuildId   string `db:"guild_id"`
}

func MapVoiceChannelToModel(vc VoiceChannel) *model.VoiceChannel {
	return &model.VoiceChannel{
		ID:        vc.ID,
		Name:      vc.Name,
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
