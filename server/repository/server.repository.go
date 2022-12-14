package repository

type serverRepo struct{}

var Server serverRepo

// func (sr serverRepo) FindById(id string) (*entities.Server, error) {
// 	sql, args, err := sq.Select("*").From("servers").ToSql()
// 	if err != nil {
// 	}

// }
