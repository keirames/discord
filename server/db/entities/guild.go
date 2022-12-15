package entities

import "discord/graph/model"

type Guild struct {
	ID            string         `db:"id"`
	Title         string         `db:"title"`
	CreatedAt     string         `db:"created_at"`
	GuildId       string         `db:"guild_id"`
	VoiceChannels []VoiceChannel `db:"voice_channel"`
}

func MapGuildToModel(r Guild) *model.Guild {
	return &model.Guild{
		ID:            r.ID,
		Title:         r.Title,
		CreatedAt:     r.CreatedAt,
		VoiceChannels: MapVoiceChannelsToModel(r.VoiceChannels),
	}
}

func MapGuildsToModel(guilds []Guild) []*model.Guild {
	guildsModel := make([]*model.Guild, len(guilds))

	for idx, guild := range guilds {
		guildsModel[idx] = MapGuildToModel(guild)
	}

	return guildsModel
}
