package repository

import (
	"discord/db"

	sq "github.com/Masterminds/squirrel"
)

type voiceRoomsMembersRepository struct{}

var VoiceRoomRepository voiceRoomsMembersRepository

func (vrr voiceRoomsMembersRepository) FindMemberIdsInRoomByRoomId(id string) (*[]string, error) {
	sql, args, err := sq.Select("voice_channels_users.user_id").
		From("voice_channels_users").
		Where(sq.Eq{"voice_channel_id": id}).
		PlaceholderFormat(sq.Dollar).
		ToSql()

	if err != nil {
		return nil, err
	}

	var result []string
	err = db.Q.Select(&result, sql, args...)
	if err != nil {
		return nil, err
	}

	return &result, nil
}
