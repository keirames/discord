package repository

import (
	"squirrel/db"

	sq "github.com/Masterminds/squirrel"
)

type voiceRoomsMembersRepository struct{}

var VoiceRoomRepository voiceRoomsMembersRepository

func (vrr voiceRoomsMembersRepository) FindMemberIdsInRoomByRoomId(id string) (*[]string, error) {
	sql, args, err := sq.Select("*").
		From("voice_rooms_members").
		Where(sq.Eq{"voice_room_id": id}).
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
