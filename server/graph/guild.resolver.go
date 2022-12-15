package graph

import (
	"context"
	"discord/db/entities"
	"discord/graph/model"
	"discord/repository"
	"discord/utils"
	"fmt"
)

func guilds(ctx context.Context) ([]*model.Guild, error) {
	panic(fmt.Errorf("not implemented: Guilds - guilds"))
}

func guild(ctx context.Context, id string) (*model.Guild, error) {
	guild, err := repository.Guild.FindById(id)
	if err != nil {
		fmt.Println(err)
		return nil, utils.UserInputError()
	}

	guildModel := entities.MapGuildToModel(*guild)

	return guildModel, nil
}
