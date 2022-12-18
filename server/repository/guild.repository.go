package repository

import (
	"discord/db"
	"discord/db/entities"
	"fmt"

	"github.com/Masterminds/squirrel"
)

type guild struct{}

var Guild guild

func (sr guild) FindAll() ([]entities.Guild, error) {
	var guilds []entities.Guild

	err := db.Q.Select(&guilds, "SELECT * FROM guilds")
	if err != nil {
		return nil, err
	}

	return guilds, nil
}

func (sr guild) FindById(id string) (*entities.Guild, error) {
	var guild entities.Guild

	sql, args, err :=
		squirrel.
			Select(`guilds.*,
							vc.id as "voice_channel.id",
							vc.name as "voice_channel.name",
							vc.created_at as "voice_channel.created_at",
							vc.guild_id as "voice_channel.guild_id"`).
			From("guilds").
			LeftJoin("voice_channels as vc on vc.guild_id = guilds.id").
			PlaceholderFormat(squirrel.Dollar).
			Where(squirrel.Eq{"guilds.id": id}).
			ToSql()
	fmt.Println(sql)
	if err != nil {
		return nil, err
	}

	rows, err := db.Q.Queryx(sql, args...)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		type rowGuild struct {
			entities.Guild
			VoiceChannelID        string `db:"voice_channel.id"`
			VoiceChannelName      string `db:"voice_channel.name"`
			VoiceChannelCreatedAt string `db:"voice_channel.created_at"`
			VoiceChannelGuildId   string `db:"voice_channel.guild_id"`
		}

		var row rowGuild
		err := rows.StructScan(&row)
		if err != nil {
			return nil, err
		}

		guild.ID = row.ID
		guild.Name = row.Name
		guild.CreatedAt = row.CreatedAt
		guild.VoiceChannels = append(guild.VoiceChannels, entities.VoiceChannel{
			ID:        row.VoiceChannelID,
			Name:      row.VoiceChannelName,
			CreatedAt: row.VoiceChannelCreatedAt,
			GuildId:   row.VoiceChannelGuildId,
		})
	}

	return &guild, nil
}
